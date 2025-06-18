/*
  # Create user profiles and onboarding tables

  1. New Tables
    - `organizations` - Store organization information and logos
    - `user_profiles` - Store user profile data and onboarding status
    - `data_rooms` - Store data room information for document sharing
    - `team_invitations` - Manage team member invitations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Create storage bucket for organization assets

  3. Triggers
    - Auto-update timestamps on record changes
    - Auto-create user profiles on signup
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  is_onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create data_rooms table
CREATE TABLE IF NOT EXISTS data_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_data_rooms_updated_at ON data_rooms;
CREATE TRIGGER update_data_rooms_updated_at
  BEFORE UPDATE ON data_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_invitations_updated_at ON team_invitations;
CREATE TRIGGER update_team_invitations_updated_at
  BEFORE UPDATE ON team_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Organizations policies
  DROP POLICY IF EXISTS "Users can read organizations they belong to" ON organizations;
  DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
  DROP POLICY IF EXISTS "Organization members can update their organization" ON organizations;
  
  -- User profiles policies
  DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
  
  -- Data rooms policies
  DROP POLICY IF EXISTS "Organization members can read data rooms" ON data_rooms;
  DROP POLICY IF EXISTS "Authenticated users can create data rooms" ON data_rooms;
  DROP POLICY IF EXISTS "Organization members can update data rooms" ON data_rooms;
  
  -- Team invitations policies
  DROP POLICY IF EXISTS "Organization members can read team invitations" ON team_invitations;
  DROP POLICY IF EXISTS "Organization members can create team invitations" ON team_invitations;
  DROP POLICY IF EXISTS "Organization members can update team invitations" ON team_invitations;
  
  -- Storage policies
  DROP POLICY IF EXISTS "Organization assets are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload organization assets" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their organization assets" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their organization assets" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Ignore if policies don't exist
END $$;

-- Organizations policies
CREATE POLICY "Users can read organizations they belong to"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization members can update their organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- User profiles policies
CREATE POLICY "Users can read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Data rooms policies
CREATE POLICY "Organization members can read data rooms"
  ON data_rooms
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create data rooms"
  ON data_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update data rooms"
  ON data_rooms
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Team invitations policies
CREATE POLICY "Organization members can read team invitations"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create team invitations"
  ON team_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update team invitations"
  ON team_invitations
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for organization assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-assets', 'organization-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Organization assets are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'organization-assets');

CREATE POLICY "Authenticated users can upload organization assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'organization-assets');

CREATE POLICY "Users can update their organization assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'organization-assets');

CREATE POLICY "Users can delete their organization assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'organization-assets');