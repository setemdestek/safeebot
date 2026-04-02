import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'

export async function DELETE() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
            logError('delete-account/auth', authError)
            return NextResponse.json({ error: 'auth_error' }, { status: 401 })
        }

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { error } = await supabase.rpc('delete_own_account')

        if (error) {
            logError('delete-account/rpc', error)
            return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        logError('delete-account', err)
        return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
}
