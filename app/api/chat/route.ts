import { groq } from "@ai-sdk/groq";
import { streamText, tool } from "ai";
import { z } from "zod";

export const runtime = "edge";

async function getWeather(
  city: string,
  unit: "celsius" | "fahrenheit" = "celsius",
) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const units = unit === "celsius" ? "metric" : "imperial";

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`,
  );

  if (!res.ok) {
    return {
      error: `Could not find weather for "${city}". Please check the city name.`,
    };
  }

  const data = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    unit,
    condition: data.weather[0].description,
    humidity: `${data.main.humidity}%`,
    wind_speed: `${data.wind.speed} ${unit === "celsius" ? "m/s" : "mph"}`,
  };
}

async function getNews(topic: string, count: number = 10) {
  const apiKey = process.env.NEWSAPI_KEY;

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=${count}&sortBy=publishedAt&language=en&apiKey=${apiKey}`,
  );

  if (!res.ok) {
    return { error: `Could not fetch news for "${topic}".` };
  }

  const data = await res.json();

  if (data.articles.length === 0) {
    return { error: `No news articles found for "${topic}".` };
  }

  const articles = data.articles.map((article: any) => ({
    title: article.title,
    source: article.source.name,
    description: article.description,
    published_at: article.publishedAt,
    url: article.url,
  }));

  return { topic, total_results: data.totalResults, articles };
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are a helpful assistant.
- For math calculations, always use the calculator tool.
- For weather questions, always use the get_weather tool.
- For news questions, always use the get_news tool. For each article, summarize it with its title, source, and a brief description. You MUST end each article with its URL in this exact format: [Read more](url). Never skip the URL.`,
    messages,
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
          const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, "");
          const result = Function(`"use strict"; return (${sanitized})`)();
          return { result };
        },
      }),

      get_weather: tool({
        description: "Get real-time current weather for any city in the world.",
        parameters: z.object({
          city: z
            .string()
            .describe("The city name. Example: Mumbai, Chandigarh, London"),
          unit: z
            .enum(["celsius", "fahrenheit"])
            .default("celsius")
            .describe("Temperature unit, defaults to celsius"),
        }),
        execute: async ({ city, unit }) => {
          return await getWeather(city, unit);
        },
      }),
      get_news: tool({
        description:
          "Get the latest real-time news articles for any topic or keyword.",
        parameters: z.object({
          topic: z
            .string()
            .describe(
              "The topic or keyword to search news for. Example: AI, cricket, Tesla, India",
            ),
          count: z
            .number()
            .min(1)
            .max(10)
            .default(5)
            .describe(
              "Number of articles to fetch, between 1 and 10. Defaults to 5.",
            ),
        }),
        execute: async ({ topic, count }) => {
          return await getNews(topic, count);
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
