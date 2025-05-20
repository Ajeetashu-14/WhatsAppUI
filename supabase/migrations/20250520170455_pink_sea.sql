/*
  # WhatsApp Clone Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `status` (text)
      - `last_seen` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chats`
      - `id` (uuid, primary key)
      - `name` (text, null for direct messages)
      - `is_group` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `chat_participants`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, references chats)
      - `profile_id` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, references chats)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    username text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    status text DEFAULT 'Hey there! I am using WhatsApp',
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    is_group boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.chat_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(chat_id, profile_id)
);

CREATE TABLE public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of their chat participants"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT p.profile_id
            FROM chat_participants p
            WHERE p.chat_id IN (
                SELECT chat_id
                FROM chat_participants
                WHERE profile_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can view their chats"
    ON public.chats
    FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can create chats"
    ON public.chats
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view their chat participants"
    ON public.chat_participants
    FOR SELECT
    TO authenticated
    USING (
        chat_id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can add chat participants"
    ON public.chat_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (
        chat_id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can view messages in their chats"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (
        chat_id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their chats"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        chat_id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE profile_id = auth.uid()
        )
    );

-- Create function to create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();