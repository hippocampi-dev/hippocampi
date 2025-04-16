import { createClient } from '@supabase/supabase-js'
import { env } from '~/env';

// Create Supabase client
export const supabase = createClient(env.SUPABASE_PROJECT_URL, env.SUPABASE_SERVICE_KEY);