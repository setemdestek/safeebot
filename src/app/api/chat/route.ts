import { NextRequest, NextResponse } from "next/server";
import { WEBHOOK_URL, CHAT_TIMEOUT_MS } from "@/lib/constants";
import { chatMessageSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Autentifikasiya xətası. Lütfən hesabınıza daxil olun." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const validationResult = chatMessageSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((issue) => issue.message);
            return NextResponse.json(
                { error: errors.join(", ") },
                { status: 400 },
            );
        }

        const { chatInput, sessionId } = validationResult.data;

        // If webhook URL is not configured, return mock response
        if (
            !WEBHOOK_URL ||
            WEBHOOK_URL === "BURAYA_N8N_WEBHOOK_URL"
        ) {
            return NextResponse.json({
                output:
                    "⚠️ Webhook URL hələ konfiqurasiya edilməyib. `src/lib/constants.ts` faylında WEBHOOK_URL-i yeniləyin.",
            });
        }

        // İstəkdə göstərilən session_id-nin bu user-ə aid olub olmadığını yoxlayaq:
        const { data: sessionData, error: sessionError } = await supabase
            .from("chat_sessions")
            .select("id")
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .single();

        if (sessionError || !sessionData) {
            return NextResponse.json(
                { error: "Session tapılmadı və ya icazəniz yoxdur." },
                { status: 404 }
            );
        }

        // --- İstifadəçi mesajını DB-yə əlavə etmək frontend tərəfdən asinxron yox, buradan da edilə bilər. ---
        // Lakin bəzən frontend optimistic update edərkən özü DB-yə yazır. Əgər bura yazırıqsa:
        /*
        await supabase.from("chat_messages").insert({
            session_id: sessionId,
            role: "user",
            content: chatInput,
        });
        */

        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            CHAT_TIMEOUT_MS,
        );

        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatInput, sessionId }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json(
                { error: "Xarici xidmətlə əlaqə xətası." },
                { status: 502 },
            );
        }

        const data = await response.json();

        const botContent = data.output || data.text || data.response || "Məlumat alınmadı";

        // Və nəticəni (bot-un cavabını) birbaşa baza daxil edirik:
        const { data: botMsgInsert, error: botInsertErr } = await supabase
            .from("chat_messages")
            .insert({
                session_id: sessionId,
                role: "bot",
                content: botContent,
            })
            .select()
            .single();

        if (botInsertErr) {
            logError("chat/db-insert", botInsertErr);
            // Səssiz xəta kimi davam edə bilərik, amma loq mütləqdir.
        }

        return NextResponse.json({
            ...data,
            output: botContent,
            dbMessage: botMsgInsert
        });
    } catch (error: any) {
        logError("chat/api", error);
        const isAbort =
            error && typeof error === 'object' && error.name === "AbortError";
        return NextResponse.json(
            { error: isAbort ? "Sorğu vaxtı bitdi. Yenidən cəhd edin." : "Daxili server xətası." },
            { status: isAbort ? 504 : 500 },
        );
    }
}
