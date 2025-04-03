import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY ?? "";
const secret = process.env.STREAM_VIDEO_API_SECRET ?? "";

if (!apiKey || !secret) {
  throw new Error("Missing Stream API credentials");
}

export const client = new StreamClient(apiKey, secret);