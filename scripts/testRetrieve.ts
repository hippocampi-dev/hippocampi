#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { encoding_for_model } from 'tiktoken'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// ES Module compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

/* ---------- env ---------- */
const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL_DEV
const SUPABASE_ANON_KEY = process.env.SUPABASE_API_KEY_DEV
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

/* ---------- env ---------- */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !OPENAI_API_KEY) {
  throw new Error('❌  Missing env vars; check .env')
}
console.log(SUPABASE_URL)
console.log(SUPABASE_ANON_KEY?.slice(0, 10), '...')


const openai   = new OpenAI({ apiKey: OPENAI_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { count, error: cErr } = await supabase
  .from('hippocampi_blog_chunks')
  .select('*', { count: 'exact', head: true })

console.log('🧮  Row count visible to this key →', count)   // should be > 0
if (cErr) console.error(cErr)

/* ---------- helper ---------- */
async function embed(text: string) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  })
  return data[0].embedding as number[]
}

/* ---------- main ---------- */
async function test(question = 'What daily habits improve memory?') {
  console.log(`🔍  Query: "${question}"`)

  // 1. embed the question
  const vec = await embed(question)

  // 2. call the RPC we created in step 2‑4
  const { data: chunks, error } = await supabase.rpc('match_blog_chunks', {
    query_embedding: vec,
    match_count: 4,
  })
  if (error) throw error

  // 3. pretty‑print
  console.table(
    chunks.map((c: any, i: number) => ({
      '#': i + 1,
      score: c.score.toFixed(3),
      slug: c.blog_slug,
      preview: (c.content as string).slice(0, 60) + '…'
    }))
  )
}

test().catch(err => {
  console.error(err)
  process.exit(1)
})
