import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zayriknizmkwhlhtspml.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheXJpa25pem1rd2hsaHRzcG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTExOTksImV4cCI6MjA3NDQ2NzE5OX0.h6k0_qRFGvXtGbGkqyaZpTirJcn2usO1BHzjQ7wCgWk'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase