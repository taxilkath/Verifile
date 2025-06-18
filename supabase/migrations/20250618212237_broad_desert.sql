/*
  # Fix Organization RLS Policies

  1. Security Updates
    - Remove conflicting organization policies
    - Add simple policy for authenticated users to create organizations
    - Ensure users can read organizations they belong to after profile creation
    
  2. Changes
    - Drop existing INSERT policy that may be causing conflicts
    - Create new INSERT policy allowing any authenticated user to create organizations
    - Keep existing SELECT and UPDATE policies for organization members
*/

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization members can update their organization" ON organizations;
DROP POLICY IF EXISTS "Users can read organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Users can read their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their own organization" ON organizations;

-- Create new INSERT policy that allows any authenticated user to create organizations
CREATE POLICY "Authenticated users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create SELECT policy for organization members
CREATE POLICY "Organization members can read organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT user_profiles.organization_id
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- Create UPDATE policy for organization members
CREATE POLICY "Organization members can update organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT user_profiles.organization_id
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT user_profiles.organization_id
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );