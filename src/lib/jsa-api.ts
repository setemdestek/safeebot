import { JSAMetadata } from '@/types/jsa';

export async function analyzeImages(files: File[], metadata: JSAMetadata): Promise<{ blob: Blob; fileName: string }> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('metadata', JSON.stringify(metadata));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    try {
        const apiUrl = '/api/jsa-analyze';

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            // Brauzer avtomatik olaraq 'multipart/form-data' və 'boundary' əlavə edəcək.
            // AbortController client side-da deyil server side da idare olunur.
        });

        if (!response.ok) {
            let errorMessage = `Xəta baş verdi (Kod: ${response.status})`;
            try {
                const errorData = await response.json();
                if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
                // If it isn't JSON
                if (response.status === 401) errorMessage = "Autentifikasiya xətası. Lütfən hesabınıza daxil olun.";
                else if (response.status === 413) errorMessage = "Şəkillər çox böyükdür. Hər biri maks 10MB olmalıdır.";
                else if (response.status >= 500) errorMessage = "Server xətası. Bir az sonra yenidən cəhd edin.";
            }
            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        const fileName = `JSA_Hesabat_${Date.now()}.docx`;

        return { blob, fileName };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Analiz vaxtı bitdi (120 san). Şəkil sayını azaldıb cəhd edin.");
        }
        throw error;
    }
}

export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 10000);
}
