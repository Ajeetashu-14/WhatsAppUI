/*
  # Add test users and chat data

  1. New Data
    - Create two test users: Abhishek and Vaibhav
    - Create a chat between them
    - Add some initial messages
*/

-- Insert test users into auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'abhishek@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'vaibhav@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', now(), now(), now());

-- Insert profiles for test users
INSERT INTO public.profiles (id, username, full_name)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'abhishek', 'Abhishek Kumar'),
  ('22222222-2222-2222-2222-222222222222', 'vaibhav', 'Vaibhav Singh');

-- Create a chat between Abhishek and Vaibhav
INSERT INTO public.chats (id, name, is_group)
VALUES ('33333333-3333-3333-3333-333333333333', 'Abhishek & Vaibhav', false);

-- Add both users to the chat
INSERT INTO public.chat_participants (chat_id, profile_id)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222');

-- Add some initial messages
INSERT INTO public.messages (chat_id, sender_id, content, created_at)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Hey Vaibhav! How are you?', now() - interval '1 hour'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Hi Abhishek! I''m good, how about you?', now() - interval '55 minutes'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'I''m doing great! Just testing out this new chat app.', now() - interval '50 minutes');