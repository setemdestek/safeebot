import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            console.error('[delete-account] Auth error:', authError.message)
            return NextResponse.json({ error: 'auth_error' }, { status: 401 })
        }

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { error } = await supabase.rpc('delete_own_account')

        if (error) {
            console.error('[delete-account] RPC error:', error.message)
            return NextResponse.json({ error: 'delete_failed', message: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[delete-account] Unexpected error:', err)
        return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
}
