/*
  # Add test users and chats

  1. New Data
    - Create two test users: Alice and Bob
    - Create a chat between them
    - Add some initial messages
*/

-- Insert test users into auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('d0d54aa5-e52c-4d17-a394-a5ae28d7ee95', 'alice@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', now(), now(), now()),
  ('f5b8c567-d123-4567-8901-234567890abc', 'bob@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', now(), now(), now());

-- Create profiles for test users
INSERT INTO public.profiles (id, username, full_name, status)
VALUES
  ('d0d54aa5-e52c-4d17-a394-a5ae28d7ee95', 'alice', 'Alice Smith', 'Hey there! I am using WhatsApp'),
  ('f5b8c567-d123-4567-8901-234567890abc', 'bob', 'Bob Johnson', 'Available');

-- Create a chat between Alice and Bob
INSERT INTO public.chats (id, name, is_group)
VALUES ('e123f456-7890-abcd-ef12-345678901234', 'Alice & Bob', false);

-- Add both users to the chat
INSERT INTO public.chat_participants (chat_id, profile_id)
VALUES 
  ('e123f456-7890-abcd-ef12-345678901234', 'd0d54aa5-e52c-4d17-a394-a5ae28d7ee95'),
  ('e123f456-7890-abcd-ef12-345678901234', 'f5b8c567-d123-4567-8901-234567890abc');

-- Add some initial messages
INSERT INTO public.messages (chat_id, sender_id, content, created_at)
VALUES 
  ('e123f456-7890-abcd-ef12-345678901234', 'd0d54aa5-e52c-4d17-a394-a5ae28d7ee95', 'Hey Bob! How are you?', now() - interval '1 hour'),
  ('e123f456-7890-abcd-ef12-345678901234', 'f5b8c567-d123-4567-8901-234567890abc', 'Hi Alice! I''m doing great, thanks for asking!', now() - interval '55 minutes');