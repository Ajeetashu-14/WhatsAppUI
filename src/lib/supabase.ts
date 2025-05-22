import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://txolqppzjfirsxyrsfin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2xxcHB6amZpcnN4eXJzZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTk3NjEsImV4cCI6MjA2MzMzNTc2MX0.RMMSte-IvSI2PtRhrL6OnsFrEHfLJDx4k9rWrIJT4DE';

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. Please connect your project to Supabase using the "Connect to Supabase" button.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. Please connect your project to Supabase using the "Connect to Supabase" button.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);