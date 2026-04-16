import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
// import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    system: "You are a helpful assistant.",
    messages: messages,
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
