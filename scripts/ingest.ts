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
const SUPABASE_KEY = process.env.SUPABASE_API_KEY_DEV
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Validate environment variables
if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL or DATABASE_URL_DEV')
if (!SUPABASE_KEY) throw new Error('Missing SUPABASE_KEY or DEV_PASSWORD')
if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

/* ---------- config ---------- */
const BLOG_DIR = path.resolve(__dirname, '../blogs') // 5 markdown files live here
const CHUNK_SIZE = 700                               // tokens
const OVERLAP = 100
const MODEL = 'text-embedding-3-small'
const tiktoken = encoding_for_model('gpt-4o-mini')

/* ---------- helpers ---------- */
function chunkText(text: string) {
  const tokens = tiktoken.encode(text)
  const chunks: string[] = []

  for (let i = 0; i < tokens.length; i += CHUNK_SIZE - OVERLAP) {
    const slice = tokens.slice(i, i + CHUNK_SIZE)
    chunks.push(Buffer.from(tiktoken.decode(slice)).toString())
  }
  return chunks
}

async function embedBatch(texts: string[]) {
  const { data } = await openai.embeddings.create({
    model: MODEL,
    input: texts,
    encoding_format: 'float'
  })
  return data.map(d => d.embedding as number[])
}

/* ---------- main ---------- */
(async () => {
  try {
    // Check if blog directory exists
    try {
      await fs.access(BLOG_DIR)
    } catch (error) {
      console.log(`Creating blog directory: ${BLOG_DIR}`)
      await fs.mkdir(BLOG_DIR, { recursive: true })
    }

    const files = await fs.readdir(BLOG_DIR)
    if (files.length === 0) {
      console.log('No markdown files found in blog directory.')
      console.log(`Please add .md files to: ${BLOG_DIR}`)
      return
    }

    for (const file of files) {
      if (!file.endsWith('.md')) continue
      
      const md = await fs.readFile(path.join(BLOG_DIR, file), 'utf8')
      const slug = path.basename(file, path.extname(file))

      // naive front‑matter parse (## Heading etc.)
      const title = (md.split('\n')[0] ?? '').replace(/^#\s*/, '')
      const url = `https://yourblog.com/${slug}`

      const chunks = chunkText(md)
      console.log(`→ ${slug}: ${chunks.length} chunks`)

      for (let i = 0; i < chunks.length; i += 20) {
        const slice = chunks.slice(i, i + 20);
        const embeds = await embedBatch(slice);

        const rows = slice.map((content, j) => ({
          blog_slug: slug,
          title,
          heading: '',
          url,
          chunk_index: i + j,
          content,
          // Convert embedding array to proper JSON string for Supabase
          embedding: JSON.stringify(embeds[j])
        }));

        console.log(`Attempting to insert chunks ${i} to ${i + slice.length - 1}`);
        
        try {
          const { error } = await supabase
            .from('hippocampi_blog_chunks')
            .insert(rows);
            
          if (error) {
            console.error(`Error inserting chunks ${i} to ${i + slice.length - 1}:`, error);
            // Try inserting one at a time to identify problematic chunks
            for (let k = 0; k < rows.length; k++) {
              const { error: singleError } = await supabase
                .from('hippocampi_blog_chunks')
                .insert([rows[k]]);
              
              if (singleError) {
                console.error(`Error inserting chunk ${i + k}:`, singleError);
              } else {
                console.log(`✓ Inserted chunk ${i + k}`);
              }
              // Small delay between individual inserts
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } else {
            console.log(`✓ Inserted chunks ${i} to ${i + slice.length - 1}`);
          }
        } catch (insertError) {
          console.error('Unexpected error during insert:', insertError);
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    console.log('✅  Ingestion complete');
  } catch (error) {
    console.error('Error during ingestion:', error);
    process.exit(1);
  }
})();
