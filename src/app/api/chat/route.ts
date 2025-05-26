// app/api/chat/route.ts
import { streamText, createDataStreamResponse } from 'ai';
import { openai } from '@ai-sdk/openai';
import { retrieve } from '~/app/_actions/blog/actions';
import { createStreamableValue } from 'ai/rsc';

// ────────────────────────────────────────────────────────────
//  POST  /api/chat
// ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const { messages } = await req.json();

  /* ── 1. RAG retrieval ──────────────────────────────────── */
  const question = messages.at(-1).content as string;
  const sources  = await retrieve(question, 4);          // k = 4

  /* Build numbered context block and remind the model to cite */
  const context = sources
    .map((s, i) => `[${i + 1}] (${s.title})\n${s.content}`)
    .join('\n\n');

  const systemPrompt = `
You are **Hippocampi Coach**, a compassionate assistant for chemobrain patients.
When you use information from the resources list, cite it inline like [1], [2], etc.
IMPORTANT: Only use citation numbers that match the sources provided (1 through ${sources.length}).
Never cite numbers like [5] or higher if only 4 sources are provided.
Helpful resources:
${context}`.trim();

  const stream = createStreamableValue("");

  /* ── 2. LLM streaming ──────────────────────────────────── */
  const llmResult = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  /* ── 3. Merge LLM stream + push our sources ────────────── */
  return createDataStreamResponse({
    async execute(ds) {
      // Forward every chunk from the LLM to the client…
      llmResult.mergeIntoDataStream(ds);      // ← helper provided by the SDK

      // Wait for stream to complete before adding sources

      // ...then append our source list so the UI gets proper <source> parts.
      sources.forEach((s, i) =>
        ds.writeSource({
          id: String(i + 1),            // "1", "2", …
          sourceType: 'url',
          url: s.url,                   // or absolute pathname if internal
          title: s.title ?? s.heading,  // optional, shown in link text
        })
      );
    },
    /* Optional error masking */
    onError: (err) => `Sorry, something went wrong (${err})`,
  });
}
