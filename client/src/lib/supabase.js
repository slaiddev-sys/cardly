import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbdovlothaubhxdanzwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZG92bG90aGF1Ymh4ZGFuend5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjI5MzYsImV4cCI6MjA4MDE5ODkzNn0.WsuTcAHgW7ACgJxoCw6j2ocUgNveEEihZ2_AQ3ZxiWc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: false,
        autoRefreshToken: true,
        flowType: 'pkce',
    },
});
