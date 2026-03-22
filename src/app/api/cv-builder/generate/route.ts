import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCV } from '@/lib/cv-builder/generate-cv';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';
import { cvFormSchema } from '@/lib/validations-cv';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: 'Autentifikasiya xətası.' }, { status: 401 });
    }

    // 2. Rate limit check
    const { data: limitCheck, error: rpcError } = await supabase.rpc('check_cv_limits', {
      p_user_id: user.id,
      p_action: 'generate',
    });
    if (rpcError) {
      console.error('RPC Error:', rpcError);
      return NextResponse.json({ message: 'Server xətası.' }, { status: 500 });
    }
    if (limitCheck && !limitCheck.allowed) {
      return NextResponse.json({ message: limitCheck.reason }, { status: 429 });
    }

    // 3. Parse FormData
    const formData = await request.formData();
    const cvDataRaw = formData.get('cvData');
    const photoFile = formData.get('photo') as File | null;

    if (!cvDataRaw || typeof cvDataRaw !== 'string') {
      return NextResponse.json({ message: 'CV data tələb olunur.' }, { status: 400 });
    }

    // 4. Validate
    const parsed = JSON.parse(cvDataRaw);
    const validation = cvFormSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json({ message: 'Validasiya xətası.', errors: validation.error.flatten() }, { status: 400 });
    }

    // 5. Sanitize
    const sanitizedData = sanitizeCVData({ ...validation.data, photo: null } as any);

    // 6. Photo processing
    let photoBuffer: Buffer | null = null;
    if (photoFile) {
      if (!['image/jpeg', 'image/png'].includes(photoFile.type)) {
        return NextResponse.json({ message: 'Yalnız JPG və PNG qəbul olunur.' }, { status: 400 });
      }
      if (photoFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ message: 'Şəkil 10MB-dan böyük olmamalıdır.' }, { status: 400 });
      }
      const arrayBuffer = await photoFile.arrayBuffer();
      photoBuffer = Buffer.from(arrayBuffer);
    }

    // 7. Generate DOCX
    const docxBuffer = await generateCV(sanitizedData, photoBuffer);

    // 8. Return DOCX
    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="CV_${sanitizedData.personalInfo.firstName}_${sanitizedData.personalInfo.lastName}.docx"`,
      },
    });
  } catch (error) {
    console.error('CV Generate Error:', error);
    return NextResponse.json({ message: 'CV yaradılarkən xəta baş verdi.' }, { status: 500 });
  }
}
