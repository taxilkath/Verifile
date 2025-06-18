/*
  # Fix Organization RLS Policies

  1. Policy Updates
    - Update INSERT policy for organizations to properly allow authenticated users
    - Ensure the policy logic is correct for new organization creation
    
  2. Security
    - Maintain RLS protection while allowing proper onboarding flow
    - Ensure authenticated users can create organizations during onboarding
*/

-- Drop existing policies to recreate them with correct logic
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization members can read organizations" ON organizations;
DROP POLICY IF EXISTS "Organization members can update organizations" ON organizations;

-- Recreate INSERT policy with proper logic for authenticated users
CREATE POLICY "Authenticated users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Recreate SELECT policy to allow reading organizations where user is a member
CREATE POLICY "Organization members can read organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM user_profiles
      WHERE id = auth.uid()
      AND organization_id IS NOT NULL
    )
  );

-- Recreate UPDATE policy to allow updating organizations where user is a member
CREATE POLICY "Organization members can update organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM user_profiles
      WHERE id = auth.uid()
      AND organization_id IS NOT NULL
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id
      FROM user_profiles
      WHERE id = auth.uid()
      AND organization_id IS NOT NULL
    )
  );