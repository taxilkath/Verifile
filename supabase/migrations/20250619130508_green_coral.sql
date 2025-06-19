/*
  # Create complete_onboarding RPC function

  1. New Function
    - `complete_onboarding` - Atomic function to handle the entire onboarding process
    - Creates organization, updates user profile, creates data room, and sends invitations
    - Returns the new organization ID on success

  2. Security
    - Function runs with SECURITY DEFINER to ensure proper permissions
    - All operations are wrapped in a transaction for atomicity
*/

CREATE OR REPLACE FUNCTION complete_onboarding(
  p_user_id uuid,
  p_org_name text,
  p_dr_name text,
  p_dr_desc text DEFAULT NULL,
  p_invites text[] DEFAULT ARRAY[]::text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id uuid;
  v_dr_id uuid;
  v_invite_email text;
BEGIN
  -- Create organization
  INSERT INTO organizations (name)
  VALUES (p_org_name)
  RETURNING id INTO v_org_id;

  -- Update user profile with organization and mark as onboarded
  UPDATE user_profiles
  SET 
    organization_id = v_org_id,
    is_onboarded = true,
    updated_at = now()
  WHERE id = p_user_id;

  -- Create data room
  INSERT INTO data_rooms (organization_id, name, description, created_by)
  VALUES (v_org_id, p_dr_name, p_dr_desc, p_user_id)
  RETURNING id INTO v_dr_id;

  -- Create team invitations
  IF array_length(p_invites, 1) > 0 THEN
    FOREACH v_invite_email IN ARRAY p_invites
    LOOP
      INSERT INTO team_invitations (organization_id, email, invited_by)
      VALUES (v_org_id, v_invite_email, p_user_id);
    END LOOP;
  END IF;

  RETURN v_org_id;
END;
$$;