import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gpt-oss:120b-cloud";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const askOllamaSchema = z.object({
  message: z.string().min(1).max(8000),
  history: z.array(chatMessageSchema).max(12).default([]),
});

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
  error?: string;
};

export const askOllama = createServerFn({ method: "POST" })
  .validator(askOllamaSchema)
  .handler(async ({ data }) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          stream: false,
          messages: [
            {
              role: "system",
              content:
                "You are مرشدي, a helpful university assistant. Answer clearly and naturally. If the user writes Arabic, answer in Arabic. If the question is about university-specific catalog data and you are not given exact data, say what you can generally and suggest checking the official university office for final confirmation. Keep answers concise unless the user asks for detail.",
            },
            ...data.history,
            { role: "user", content: data.message },
          ],
          options: {
            temperature: 0.4,
          },
        }),
      });

      if (!response.ok) {
        return {
          ok: false,
          text: `Ollama returned ${response.status}. Make sure Ollama is running and the ${OLLAMA_MODEL} model is available.`,
        };
      }

      const result = (await response.json()) as OllamaChatResponse;
      const text = result.message?.content?.trim();

      if (!text) {
        return {
          ok: false,
          text: result.error ?? "Ollama did not return a response.",
        };
      }

      return { ok: true, text };
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      return {
        ok: false,
        text: isAbort
          ? "Ollama took too long to respond. Please try a shorter question."
          : `Could not connect to Ollama at ${OLLAMA_URL}. Please make sure Ollama is running.`,
      };
    } finally {
      clearTimeout(timeout);
    }
  });

