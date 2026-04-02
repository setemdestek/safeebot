import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { passwordSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const passwordValidation = passwordSchema.safeParse(newPassword)
    if (!passwordValidation.success) {
        const errors = passwordValidation.error.issues.map((i) => i.message)
        return NextResponse.json({ error: 'weak_password', messages: errors }, { status: 400 })
    }

    const admin = createAdminClient()

    // Verify current password server-side (no CAPTCHA required)
    const { error: signInError } = await admin.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    })

    if (signInError) {
        return NextResponse.json({ error: 'wrong_password' }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
        password: newPassword,
    })

    if (updateError) {
        return NextResponse.json({ error: 'update_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
