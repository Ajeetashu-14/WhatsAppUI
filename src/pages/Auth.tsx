import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw signInError;
        }
      } else {
        // For signup, create auth user first
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username, // Store username in user metadata
            },
          },
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          // Profile will be created automatically by the trigger function
          // No need to manually insert into profiles table
          console.log('User created successfully');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-[#202c33] rounded-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <MessageCircle className="w-12 h-12 text-[#00a884]" />
          <h1 className="text-2xl font-bold text-white">WhatsApp Web Clone</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              required
            />
          </div>
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                required
              />
            </div>
          )}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2a3942] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a884] text-white py-2 rounded font-medium hover:bg-[#008f6f] transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-[#00a884] text-sm hover:underline"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}