import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const body = await req.json();
  const result = await generateObject({
    model: openai('gpt-4o'),
    system: 'You will generate an ideal doctor profile.',
    prompt: body,
    schema: z.object({
          doctor: z.object({
            name: z.string().describe('Name of a fictional person.'),
          bio: z.string().describe('Do not use emojis or links.'),
          specialty: z.string().describe('use a single word')}),
        reasoning: z.string().describe('explain the why this doctor pertains to the user\'s answers')
    }),
  });
  console.log(result.toJsonResponse())
  return result.toJsonResponse();
}