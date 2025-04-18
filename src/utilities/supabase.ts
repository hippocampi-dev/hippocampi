import { createClient } from '@supabase/supabase-js'
import { getSupabaseProjectUrl, getSupabaseServiceKey } from '~/env';

// Create Supabase client
export const supabase = createClient(getSupabaseProjectUrl(), getSupabaseServiceKey());