/*
  # Create Verifile Database Schema

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `logo_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `organization_id` (uuid, references organizations)
      - `full_name` (text)
      - `is_onboarded` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `data_rooms`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `name` (text, required)
      - `description` (text, optional)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `team_invitations`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `email` (text, required)
      - `invited_by` (uuid, references auth.users)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create storage bucket for organization assets
    - Add storage policies for file uploads

  3. Functions & Triggers
    - Auto-create user profile on signup
    - Auto-update timestamps on record changes
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
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  full_name text,
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
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers (with existence checks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_organizations_updated_at'
  ) THEN
    CREATE TRIGGER update_organizations_updated_at
      BEFORE UPDATE ON organizations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_data_rooms_updated_at'
  ) THEN
    CREATE TRIGGER update_data_rooms_updated_at
      BEFORE UPDATE ON data_rooms
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Organizations policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Users can read organizations they belong to'
  ) THEN
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Users can create organizations'
  ) THEN
    CREATE POLICY "Users can create organizations"
      ON organizations
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Organization members can update their organization'
  ) THEN
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
  END IF;
END $$;

-- User profiles policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can read their own profile'
  ) THEN
    CREATE POLICY "Users can read their own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

-- Data rooms policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'data_rooms' AND policyname = 'Organization members can read data rooms'
  ) THEN
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'data_rooms' AND policyname = 'Authenticated users can create data rooms'
  ) THEN
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'data_rooms' AND policyname = 'Organization members can update data rooms'
  ) THEN
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
  END IF;
END $$;

-- Team invitations policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'team_invitations' AND policyname = 'Organization members can read team invitations'
  ) THEN
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'team_invitations' AND policyname = 'Authenticated users can create team invitations'
  ) THEN
    CREATE POLICY "Authenticated users can create team invitations"
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'team_invitations' AND policyname = 'Organization members can update team invitations'
  ) THEN
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
  END IF;
END $$;

-- Create storage bucket for organization assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-assets', 'organization-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for organization assets (with existence checks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies WHERE name = 'Authenticated users can upload organization assets'
  ) THEN
    CREATE POLICY "Authenticated users can upload organization assets"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'organization-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies WHERE name = 'Anyone can view organization assets'
  ) THEN
    CREATE POLICY "Anyone can view organization assets"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'organization-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies WHERE name = 'Users can update their organization assets'
  ) THEN
    CREATE POLICY "Users can update their organization assets"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'organization-assets');
  END IF;
END $$;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup (with existence check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;