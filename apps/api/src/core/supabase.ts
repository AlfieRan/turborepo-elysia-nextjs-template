import { createClient } from '@supabase/supabase-js';

import { env } from '../config.js';

export const supabase = createClient(env.supabase.URL, env.supabase.PUBLISHABLE_KEY);
export const supabaseAdmin = createClient(env.supabase.URL, env.supabase.SERVICE_ROLE_KEY);
