import { groq } from "@ai-sdk/groq";
import { streamText, tool } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    system:
      "You are a helpful assistant. When the user asks any math calculation, always use the calculator tool. Never calculate yourself.",
    messages: messages,
    tools: {
      calculator: tool({
        description:
          "Use this tool for any math calculation — addition, subtraction, multiplication, division.",
        parameters: z.object({
          expression: z
            .string()
            .describe("The math expression to calculate. Example: 2349 * 8743"),
        }),
        execute: async ({ expression }) => {
          try {
            const result = Function(`"use strict"; return (${expression})`)();
            return { result };
          } catch {
            return { result: "Invalid expression" };
          }
        },
      }),
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
