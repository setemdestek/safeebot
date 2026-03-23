import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/cv-builder/gemini';
import { buildAnalysisPrompt } from '@/lib/cv-builder/prompts';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';
import { cvFormSchema, cvAnalysisResultSchema } from '@/lib/validations-cv';
import { parseGeminiJSON } from '@/lib/cv-builder/parse-gemini-json';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: 'Autentifikasiya xətası.' }, { status: 401 });
    }

    const { data: limitCheck, error: rpcError } = await supabase.rpc('check_cv_limits', {
      p_user_id: user.id,
      p_action: 'analyze',
    });
    if (rpcError) return NextResponse.json({ message: 'Server xətası.' }, { status: 500 });
    if (limitCheck && !limitCheck.allowed) {
      return NextResponse.json({ message: limitCheck.reason }, { status: 429 });
    }

    const body = await request.json();
    const inputValidation = cvFormSchema.safeParse(body.cvData);
    if (!inputValidation.success) {
      return NextResponse.json({ message: 'Validasiya xətası.' }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedData = sanitizeCVData({ ...inputValidation.data, photo: null } as any);

    const prompt = buildAnalysisPrompt(sanitizedData);

    let rawText: string;
    try {
      rawText = await callGemini(prompt);
    } catch (err) {
      console.error('Gemini API Error:', err);
      return NextResponse.json({ message: 'AI xidməti müvəqqəti əlçatmazdır.' }, { status: 503 });
    }

    let parsed: unknown;
    try {
      parsed = parseGeminiJSON(rawText);
    } catch {
      // Retry once
      try {
        const retryText = await callGemini(prompt);
        parsed = parseGeminiJSON(retryText);
      } catch {
        return NextResponse.json({ message: 'AI cavabı düzgün formatda deyil.' }, { status: 502 });
      }
    }

    const validation = cvAnalysisResultSchema.safeParse(parsed);
    if (!validation.success) {
      console.error('Gemini response validation failed:', validation.error);
      return NextResponse.json({ message: 'AI cavabı düzgün formatda deyil.' }, { status: 502 });
    }

    return NextResponse.json(validation.data);
  } catch (error) {
    console.error('CV Analyze Error:', error);
    return NextResponse.json({ message: 'Analiz zamanı xəta baş verdi.' }, { status: 500 });
  }
}
