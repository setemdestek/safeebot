import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/cv-builder/gemini';
import { buildCoverLetterPrompt } from '@/lib/cv-builder/prompts';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';
import { coverLetterResultSchema } from '@/lib/validations-cv';

export const maxDuration = 60;

function parseGeminiJSON(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
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
    const sanitizedData = sanitizeCVData({ ...body.cvData, photo: null });
    const jobDescription = body.jobDescription || '';

    const prompt = buildCoverLetterPrompt(sanitizedData, jobDescription);

    let rawText: string;
    try {
      rawText = await callGemini(prompt);
    } catch {
      return NextResponse.json({ message: 'AI xidməti müvəqqəti əlçatmazdır.' }, { status: 503 });
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
    console.error('Cover Letter Error:', error);
    return NextResponse.json({ message: 'Məktub yaradılarkən xəta baş verdi.' }, { status: 500 });
  }
}
