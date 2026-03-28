import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE() {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('[delete-account] SUPABASE_SERVICE_ROLE_KEY is not set')
            return NextResponse.json({ error: 'server_config_error' }, { status: 500 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            console.error('[delete-account] Auth error:', authError.message)
            return NextResponse.json({ error: 'auth_error' }, { status: 401 })
        }

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { error } = await admin.auth.admin.deleteUser(user.id)

        if (error) {
            console.error('[delete-account] Supabase admin deleteUser error:', error.message)
            return NextResponse.json({ error: 'delete_failed', message: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[delete-account] Unexpected error:', err)
        return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
}
