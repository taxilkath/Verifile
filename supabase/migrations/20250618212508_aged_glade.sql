/*
  # Fix Organization Creation RLS Policy

  1. Policy Updates
    - Update the INSERT policy for organizations to allow any authenticated user to create organizations
    - This is necessary for the onboarding flow where users need to create their first organization

  2. Security
    - Maintains security by requiring authentication
    - Allows organization creation during onboarding process
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

-- Create a new policy that allows any authenticated user to create organizations
CREATE POLICY "Any authenticated user can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure the existing SELECT and UPDATE policies remain intact for organization members
-- (These policies are already correctly configured based on the schema)