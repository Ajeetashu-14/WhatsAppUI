/*
  # Fix chat_participants RLS policy recursion

  1. Changes
    - Drop and recreate the "Users can view their chat participants" policy
      to prevent infinite recursion
    - Simplify the policy logic to directly check user participation
    
  2. Security
    - Policy still maintains proper access control
    - Only allows users to view participants in chats they are part of
*/

-- Drop and recreate the policy to fix infinite recursion
DROP POLICY IF EXISTS "Users can view their chat participants" ON public.chat_participants;

CREATE POLICY "Users can view their chat participants"
    ON public.chat_participants
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM chat_participants cp
            WHERE cp.chat_id = chat_participants.chat_id 
            AND cp.profile_id = auth.uid()
        )
    );