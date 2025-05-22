/*
  # Add mock users and chats

  1. New Data
    - Create test users in auth.users
    - Create their profiles
    - Create chat rooms
    - Add chat participants
    - Add some initial messages
*/

-- Insert test users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('mock-user-1', 'sarah@example.com', '{"username": "Sarah Wilson", "avatar_url": null}'::jsonb),
  ('mock-user-2', 'alex@example.com', '{"username": "Alex Chen", "avatar_url": null}'::jsonb),
  ('mock-user-3', 'mike@example.com', '{"username": "Mike Johnson", "avatar_url": null}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert profiles for test users
INSERT INTO public.profiles (id, username, full_name)
VALUES
  ('mock-user-1', 'sarah@example.com', 'Sarah Wilson'),
  ('mock-user-2', 'alex@example.com', 'Alex Chen'),
  ('mock-user-3', 'mike@example.com', 'Mike Johnson')
ON CONFLICT (id) DO NOTHING;

-- Create chats
INSERT INTO public.chats (id, name, is_group)
VALUES
  ('chat-1', 'Sarah Wilson', false),
  ('chat-2', 'Alex Chen', false),
  ('chat-3', 'Mike Johnson', false)
ON CONFLICT (id) DO NOTHING;

-- Add chat participants
INSERT INTO public.chat_participants (chat_id, profile_id)
SELECT 'chat-1', id FROM auth.users WHERE email = 'sarah@example.com'
ON CONFLICT (chat_id, profile_id) DO NOTHING;

INSERT INTO public.chat_participants (chat_id, profile_id)
SELECT 'chat-2', id FROM auth.users WHERE email = 'alex@example.com'
ON CONFLICT (chat_id, profile_id) DO NOTHING;

INSERT INTO public.chat_participants (chat_id, profile_id)
SELECT 'chat-3', id FROM auth.users WHERE email = 'mike@example.com'
ON CONFLICT (chat_id, profile_id) DO NOTHING;

-- Add some initial messages
INSERT INTO public.messages (chat_id, sender_id, content)
VALUES
  ('chat-1', 'mock-user-1', 'Hey there! 👋'),
  ('chat-2', 'mock-user-2', 'Hello! How are you?'),
  ('chat-3', 'mock-user-3', 'Hi everyone! Nice to meet you all!')
ON CONFLICT (id) DO NOTHING;