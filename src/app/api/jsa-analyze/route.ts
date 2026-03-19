import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        // 1. Session yoxlanışı
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { message: 'Autentifikasiya xətası. Lütfən hesabınıza daxil olun.' },
                { status: 401 }
            );
        }

        // 2. Limit yoxlanışı və Qeydiyyat (Atomik RPC funksiyası ilə)
        // Limit yoxlanışı AKTİVDİR
        const ENABLE_LIMITS = true;

        if (ENABLE_LIMITS) {
            const { data: limitCheck, error: rpcError } = await supabase.rpc('check_jsa_limits', {
                p_user_id: user.id
            });

            if (rpcError) {
                console.error('RPC Error:', rpcError);
                return NextResponse.json(
                    { message: 'Limitləri yoxlayarkən server xətası baş verdi.' },
                    { status: 500 }
                );
            }

            if (limitCheck && !limitCheck.allowed) {
                return NextResponse.json(
                    { message: limitCheck.reason },
                    { status: limitCheck.code || 429 }
                );
            }
        }

        // 3. Əgər hər şey yaxşıdırsa (allowed: true), FormData-nı oxu
        const formData = await request.formData();

        // 4. Webhook URL (yalnız server-side env var-dan oxunur)
        const webhookUrl = process.env.JSA_WEBHOOK_URL || process.env.WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                { message: 'Webhook URL konfiqurasiya edilməyib. Administratora müraciət edin.' },
                { status: 503 }
            );
        }

        // 5. N8N Webhook-a sorğu göndər
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 san timeout

        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 413) {
                return NextResponse.json({ message: 'Şəkillər çox böyükdür. Hər biri maks 10MB olmalıdır.' }, { status: 413 });
            }
            return NextResponse.json({ message: `Webhook xətası (Kod: ${response.status})` }, { status: response.status });
        }

        // 6. Uğurlu olduqda Blob-u (DOCX faylını) birbaşa client-ə ötür
        const blob = await response.blob();
        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
        });

    } catch (error: any) {
        if (error.name === 'AbortError') {
            return NextResponse.json(
                { message: 'Analiz vaxtı bitdi (120 san). Şəkil sayını azaldıb cəhd edin.' },
                { status: 504 }
            );
        }

        console.error('JSA Analyze API Error:', error);
        return NextResponse.json(
            { message: 'Server xətası. Bir az sonra yenidən cəhd edin.' },
            { status: 500 }
        );
    }
}
