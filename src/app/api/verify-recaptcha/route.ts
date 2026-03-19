import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.3");
      return NextResponse.json({
        success: true,
        score: verifyData.score || 0.5,
        action: verifyData.action,
        passed: (verifyData.score || 0.5) >= minScore,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "reCAPTCHA verification failed",
        "error-codes": verifyData["error-codes"],
      });
    }
  } catch (error) {
    console.error("reCAPTCHA API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
