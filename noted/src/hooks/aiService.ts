import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

type Provider = "gemini" | "openai" | "anthropic";

const PROMPTS = {
  box: "The image contains a handwritten math equation or concept inside a box. Please solve it step-by-step or explain the boxed concept clearly and concisely.",
  underline:
    "The image contains a handwritten term that was underlined. Please provide a clear, concise definition or explanation for this specific term based on the context of the handwriting.",
};

export async function askAI(
  base64Image: string,
  gestureType: "box" | "underline",
): Promise<string> {
  const provider = (localStorage.getItem("noted_ai_provider") ?? "gemini") as Provider;
  const keyMap: Record<Provider, string> = {
    gemini: "noted_api_key_gemini",
    openai: "noted_api_key_openai",
    anthropic: "noted_api_key_anthropic",
  };
  const apiKey = localStorage.getItem(keyMap[provider]);
  if (!apiKey) throw new Error("No API key found for this provider. Please add one in Settings.");

  const prompt = PROMPTS[gestureType];
  const pureBase64 = base64Image.split(",")[1];

  if (provider === "gemini") {
    const genAI = new GoogleGenAI({ apiKey });
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [prompt, { inlineData: { data: pureBase64, mimeType: "image/png" } }],
    });
    return result.text ?? "No response from Gemini";
  }

  if (provider === "openai") {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: base64Image } },
          ],
        },
      ],
    });
    return response.choices[0]?.message?.content ?? "No response from OpenAI";
  }

  // anthropic
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: pureBase64 },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "No response from Claude";
}
