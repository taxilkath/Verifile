/*
  # Fix Organization Insert RLS Policy

  1. Security Changes
    - Drop the existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure authenticated users can create organizations

  The issue was that the policy was using uid() instead of auth.uid(), 
  which caused the RLS check to fail when users tried to create organizations.
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

-- Create the corrected policy using auth.uid()
CREATE POLICY "Authenticated users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);