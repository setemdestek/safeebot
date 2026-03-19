# JSA Analiz Modulu Tətbiq Planı

## Məqsəd
Next.js 16+ App Router, React 19, TypeScript və Tailwind CSS v4 istifadə edərək HSE JSA (İş Təhlükəsizliyi Analizi) modulu yaratmaq. /dashboard səhifəsində "Risk analizi et" bölməsini qurmaq.

## 1. Mühit Dəyişənləri və Konfiqurasiya
- `.env.local` faylına mühit dəyişəni əlavə edilməsi:
  `NEXT_PUBLIC_WEBHOOK_URL=https://5pkawlqe.rpcld.co/webhook/hse-jsa-analysis`
- **Şəkil Saxlama Qaydası**: Şəkillər localStorage, server və ya diskə yazılmayacaq. Webhook-a göndərildikdən sonra URL.revokeObjectURL() ilə dərhal silinəcək.

## 2. Fayl Strukturu
- `src/app/jsa/page.tsx`
- `src/components/jsa/JSAAnalyzer.tsx` (Əsas Komponent)
- `src/components/jsa/DropZone.tsx`
- `src/components/jsa/ImagePreviewGrid.tsx`
- `src/components/jsa/MetadataForm.tsx`
- `src/components/jsa/ProgressTracker.tsx`
- `src/components/jsa/ResultPanel.tsx`
- `src/lib/jsa-api.ts`
- `src/types/jsa.ts`

## 3. Tiplərin Təyini (types/jsa.ts)
- `JSAMetadata`: inspector_name, work_location, date, company_name, notes
- `AnalysisStep`: 'idle' | 'uploading' | 'analyzing' | 'risk_assessment' | 'generating' | 'done' | 'error'
- `AnalysisState`: step, error, blob, fileName
- `PreviewFile`: id, file, previewUrl

## 4. API funksionallığının yazılması (lib/jsa-api.ts)
- `analyzeImages(files: File[], metadata: JSAMetadata)`
  - FormData yaradılması.
  - AbortController ilə 120s timeout.
  - Xətaların (401, 413, 5xx, Timeout) idarə edilməsi.
- `downloadBlob(blob: Blob, fileName: string)`
  - Nəticə (docx) faylının endirilməsi prosesi.

## 5. Komponentlərin Yaradılması
### 5.1 DropZone (components/jsa/DropZone.tsx)
- Qəbul formatları: image/jpeg, image/png, image/webp, image/heic
- 1 limit (maksimum şəkil) və 10MB limit.
- Sürükləmək (Drag & Drop) xüsusiyyəti.
- Mobilə uyğun kamera düyməsi (`capture="environment"`).

### 5.2 ImagePreviewGrid (components/jsa/ImagePreviewGrid.tsx)
- Grid layout `next/image` olmadan normal `<img />` obyekti və blob URL köməyi ilə işləyir.
- Hər şəklin üstündə fayl adı və həcmi görsənəcək, və "sil/x" düyməsi olacaq.

### 5.3 MetadataForm (components/jsa/MetadataForm.tsx)
- Forma sahələri (inspector name, location, date, company, notes).
- Tailwind utility class-ları istifadə edərək dizayn ('w-full border..', 'focus:ring-2..').

### 5.4 ProgressTracker (components/jsa/ProgressTracker.tsx)
- Yükləmə, analiz, risk qiymətləndirməsi və sənəd yaratma addımlarının vizual nümayişi.
- Dairələr, oxlar və tamamlama ikonları ilə şaquli status nümayişçisi.

### 5.5 ResultPanel (components/jsa/ResultPanel.tsx)
- Success və Error vəziyyətləri üçün dizayn (Bounce edən checkmark və ya warning icon).
- "Yenidən yüklə" və "Yeni Analiz" düymələri.

### 5.6 Əsas Komponent: JSAAnalyzer (components/jsa/JSAAnalyzer.tsx)
- State idarəsi (files, metadata, analysisState).
- Layout bölgəsinin idarə edilməsi (DropZone + ImagePreviewGrid solda, MetadataForm sağda).
- Bütün addımların `handleAnalyze` metodu ilə orkestratlaşdırılması və delay(setTimeout) vaxtlarının simulyasiyası (800ms, 1000ms və s.).

### 5.7 Səhifə: app/jsa/page.tsx
- Next.js default page metadata təyini.
- Setup layout: background color (`bg-[#F4F7FB]`) və padding-lər.

## Təxmini İcra Vaxtı
- API və Tiplərin yazılması: 30 Dəqiqə
- UI Komponentlərinin (DropZone, MetadataForm və s.) yazılması: 1 Saat
- Ana Komponent və inteqrasiya (JSAAnalyzer, State manager): 45 Dəqiqə
- Ümumi Test, Limit yoxlanışı və Hata testləri: 45 Dəqiqə

Cəmi təxmini vaxt: 3 Saat

## Növbəti Addımlar
- `/create` və ya `/enhance` komandasını istifadə edərək bu planın icrasına başlaya bilərik.
