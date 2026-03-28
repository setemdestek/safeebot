-- Run this in Supabase Dashboard → SQL Editor
-- This function allows users to delete their own account securely
-- SECURITY DEFINER means it runs with the privileges of the function owner (postgres)

CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  calling_user_id uuid;
BEGIN
  calling_user_id := auth.uid();

  IF calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete the user from auth.users (cascades to profiles, chat_sessions, etc.)
  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

-- Grant execute permission to authenticated users only
REVOKE ALL ON FUNCTION delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
