import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import JSAAnalyzer from '@/components/jsa/JSAAnalyzer'

export const metadata: Metadata = {
    title: 'JSA Analizi — HSE Portal',
    description: 'Süni intellekt ilə avtomatik iş təhlükəsizliyi analizi'
}

export default async function JSAPage() {
    const messages = await getMessages({ locale: 'az' });

    return (
        <NextIntlClientProvider locale="az" messages={messages}>
            <main className="min-h-screen bg-[#F4F7FB] py-10 px-4">
                <JSAAnalyzer />
            </main>
        </NextIntlClientProvider>
    );
}
