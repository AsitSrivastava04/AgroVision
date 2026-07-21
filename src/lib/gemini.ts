import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "./types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function buildPrompt(cropType?: string, language?: string): string {
  const lang = language === "hi" ? "Hindi" : "English";
  return `You are an expert agricultural pathologist. Analyze the uploaded image of a crop leaf.
${cropType ? `The farmer believes this is a ${cropType} crop.` : ""}
Respond in ${lang}.

Respond ONLY with valid JSON in this exact structure (no markdown, no code fences):
{
  "crop_name": "string",
  "is_healthy": boolean,
  "disease_name": "string or null if healthy",
  "confidence_percent": number between 0 and 100,
  "symptoms": ["string"],
  "causes": "string",
  "spread_pattern": "string",
  "treatment": {
    "immediate_actions": ["string"],
    "preventive_measures": ["string"],
    "recommended_products": ["string"]
  },
  "severity": "low" or "medium" or "high" or "critical"
}

If the image is NOT a plant leaf, respond ONLY with:
{"error": "not_a_leaf", "message": "Please upload a clear image of a plant leaf."}

Important rules:
- Return ONLY raw JSON, no markdown formatting.
- confidence_percent must be a number, not a string.
- If the leaf is healthy, set disease_name to null and severity to "low".`;
}

export async function analyzeLeafImage(
  imageBase64: string,
  mimeType: string,
  cropType?: string,
  language?: string
): Promise<PredictionResult | { error: string; message: string }> {
  const prompt = buildPrompt(cropType, language);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini API timeout")), 30000)
  );

  const apiPromise = genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);

  const text = response.text ?? "";

  // Strip markdown code fences if Gemini wraps in them
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      error: "parse_error",
      message: "Failed to parse AI response. Please try again.",
    };
  }
}
