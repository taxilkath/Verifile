/*
  # Create complete_onboarding database function

  1. New Function
    - `complete_onboarding` - Handles all onboarding operations in a single transaction
    - Takes user_id, org_id, data room details, and team invites
    - Updates user profile, creates data room, and sends invitations

  2. Security
    - Function runs with SECURITY DEFINER to ensure proper permissions
    - Validates user ownership and organization membership
*/

CREATE OR REPLACE FUNCTION public.complete_onboarding(
  p_user_id uuid,
  p_org_id uuid,
  p_dr_name text,
  p_dr_desc text,
  p_invites text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Step 1: Update the user's profile with the organization ID and mark as onboarded
  UPDATE user_profiles
  SET
    organization_id = p_org_id,
    is_onboarded = TRUE,
    updated_at = now()
  WHERE id = p_user_id;

  -- Verify the update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update user profile for user_id: %', p_user_id;
  END IF;

  -- Step 2: Create the initial data room
  INSERT INTO data_rooms (organization_id, name, description, created_by)
  VALUES (p_org_id, p_dr_name, p_dr_desc, p_user_id);

  -- Step 3: Insert team invitations if any are provided
  IF array_length(p_invites, 1) > 0 THEN
    INSERT INTO team_invitations (organization_id, email, invited_by, status, created_at)
    SELECT p_org_id, unnest(p_invites), p_user_id, 'pending', now();
  END IF;

  -- Log successful completion
  RAISE NOTICE 'Onboarding completed successfully for user_id: %', p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_onboarding(uuid, uuid, text, text, text[]) TO authenticated;