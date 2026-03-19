import type { Metadata } from 'next'
import JSAAnalyzer from '@/components/jsa/JSAAnalyzer'

export const metadata: Metadata = {
    title: 'JSA Analizi — HSE Portal',
    description: 'Süni intellekt ilə avtomatik iş təhlükəsizliyi analizi'
}

export default function JSAPage() {
    return (
        <main className="min-h-screen bg-[#F4F7FB] py-10 px-4">
            <JSAAnalyzer />
        </main>
    );
}
