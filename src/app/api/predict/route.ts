import { NextRequest, NextResponse } from "next/server";
import { analyzeLeafImage } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You've reached the analysis limit. Please try again in ${Math.ceil(limit.resetIn / 60000)} minutes.`,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(limit.resetIn / 1000)),
        },
      }
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const cropType = (formData.get("cropType") as string) || undefined;
    const language = (formData.get("language") as string) || "en";

    if (!imageFile) {
      return NextResponse.json(
        { error: "no_image", message: "No image provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        {
          error: "invalid_type",
          message: "Only JPG, JPEG, and PNG images are supported.",
        },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: "too_large",
          message: "Image must be under 5MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await analyzeLeafImage(
      base64,
      imageFile.type,
      cropType,
      language
    );

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);

    if (error instanceof Error && error.message === "Gemini API timeout") {
      return NextResponse.json(
        {
          error: "timeout",
          message: "Analysis took too long. Please try again.",
        },
        { status: 504 }
      );
    }

    // Surface quota / auth errors clearly
    const errMsg =
      error instanceof Error ? error.message : String(error);

    if (errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          message:
            "API quota exceeded. Please wait a few minutes or upgrade your Gemini API plan.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "server_error",
        message: "Analysis temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
