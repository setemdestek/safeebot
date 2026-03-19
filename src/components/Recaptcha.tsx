"use client";

export { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";

export function useRecaptcha(action: string = "submit") {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleExecuteRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA not loaded");
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      return null;
    }
  }, [executeRecaptcha, action]);

  return {
    executeRecaptcha: handleExecuteRecaptcha,
  };
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success === true && data.score >= 0.3;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}
