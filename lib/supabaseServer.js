// server-only helper for API routes / server actions
import { createClient } from '@supabase/supabase-js';

export function getSupabaseServer(readWrite = 'anon') {
  const url = process.env.SUPABASE_URL;
  const key =
    readWrite === 'service'
      ? process.env.SUPABASE_SERVICE_ROLE
      : process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing');
  }
  return createClient(url, key);
}