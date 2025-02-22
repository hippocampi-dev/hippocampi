import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: "strict", // strict mode, enable when using the OpenAI API
  apiKey: process.env["OPENAI_API_KEY"],
});

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export { client, openai };
