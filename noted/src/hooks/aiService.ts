import { GoogleGenAI } from "@google/genai";

export async function askGemini(
  base64Image: string,
  gestureType: "box" | "underline",
) {
  const apiKey = localStorage.getItem("noted_api_key");
  if (!apiKey) throw new Error("No API Key found. Please add one in Settings.");

  const genAI = new GoogleGenAI({ apiKey: apiKey });

  const prompt =
    gestureType === "box"
      ? "The image contains a handwritten math equation or concept inside a box. Please solve it step-by-step or explain the boxed concept clearly and concisely."
      : "The image contains a handwritten term that was underlined. Please provide a clear, concise definition or explanation for this specific term based on the context of the handwriting.";

  // remove the data:image/png;base64, prefix for the SDK
  const pureBase64 = base64Image.split(",")[1];

  const result = await genAI.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: [
      prompt,
      { inlineData: { data: pureBase64, mimeType: "image/png" } },
    ],
  });

  return result.text;
}

// export async function askGemini(
//   base64data: string,
//   type: "box" | "underline",
// ): Promise<string> {
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
//   return type === "box"
//     ? "Box detected: this looks like a diagram element"
//     : "Underline detected: this text seems important";
// }
