import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/cv-builder/gemini';
import { buildCoverLetterPrompt } from '@/lib/cv-builder/prompts';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';
import { parseGeminiJSON } from '@/lib/cv-builder/parse-gemini-json';
import { cvFormSchema, coverLetterResultSchema } from '@/lib/validations-cv';
import { logError } from '@/lib/logger';

export const maxDuration = 60;

const MAX_JOB_DESCRIPTION_LENGTH = 5000;

function sanitizeJobDescription(raw: unknown): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.slice(0, MAX_JOB_DESCRIPTION_LENGTH).replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: 'Autentifikasiya xətası.' }, { status: 401 });
    }

    const { data: limitCheck, error: rpcError } = await supabase.rpc('check_cv_limits', {
      p_user_id: user.id,
      p_action: 'cover_letter',
    });
    if (rpcError) return NextResponse.json({ message: 'Server xətası.' }, { status: 500 });
    if (limitCheck && !limitCheck.allowed) {
      return NextResponse.json({ message: limitCheck.reason }, { status: 429 });
    }

    const body = await request.json();
    const inputValidation = cvFormSchema.safeParse(body.cvData);
    if (!inputValidation.success) {
      return NextResponse.json({ message: 'Validasiya xətası.', errors: inputValidation.error.flatten() }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedData = sanitizeCVData({ ...inputValidation.data, photo: null } as any);
    const jobDescription = sanitizeJobDescription(body.jobDescription);

    const prompt = buildCoverLetterPrompt(sanitizedData, jobDescription);

    let rawText: string;
    try {
      rawText = await callGemini(prompt);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logError('cover-letter/gemini', errMsg);
      if (errMsg.includes('API_KEY') || errMsg.includes('401') || errMsg.includes('403')) {
        return NextResponse.json({ message: 'Gemini API açarı yanlışdır və ya etibarsızdır.' }, { status: 503 });
      }
      return NextResponse.json({ message: 'AI xidməti müvəqqəti əlçatmazdır. Bir az sonra cəhd edin.' }, { status: 503 });
    }

    let parsed: unknown;
    try {
      parsed = parseGeminiJSON(rawText);
    } catch {
      try {
        const retryText = await callGemini(prompt);
        parsed = parseGeminiJSON(retryText);
      } catch {
        return NextResponse.json({ message: 'AI cavabı düzgün formatda deyil.' }, { status: 502 });
      }
    }

    const validation = coverLetterResultSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json({ message: 'AI cavabı düzgün formatda deyil.' }, { status: 502 });
    }

    return NextResponse.json(validation.data);
  } catch (error) {
    logError('cover-letter', error);
    return NextResponse.json({ message: 'Məktub yaradılarkən xəta baş verdi.' }, { status: 500 });
  }
}
