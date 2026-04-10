# SafeBot Layihəsi Xülasəsi

Bu sənəd **SafeBot Proje** üçün istifadə edilən texnologiyalar, memarlıq, işləmə prinsipi və alətlər barədə ətraflı məlumatı özündə əks etdirir.

## 1. Texnologiya Yığını (Technology Stack)

SafeBot tamhüquqlu (full-stack) veb tətbiqidir və əsasən müasir frontend/backend texnologiyalarından və serverless yanaşmadan istifadə edir:
- **Framework:** Next.js (App Router, v16.1.6)
- **Frontend Kitabxanası:** React (v19.2), TypeScript
- **Verilənlər Bazası və Autentifikasiya:** Supabase (PostgreSQL)
- **Stilizasiya:** Tailwind CSS (v4), Radix UI (komponentlər)
- **Süni İntellekt (AI) & Avtomatlaşdırma:** Google Generative AI (Gemini API), N8n Webhooks

## 2. İşləmə Prinsipi (Working Principle)

Sistem istifadəçiyə süni intellekt əsaslı dəstək botu xidməti (chat interface) təqdim edir. Bütün məlumatlar məxfilik (Row Level Security) və sessiya məntiqi ilə qorunur.

**Əsas Məntiq:**
1. **Giriş:** İstifadəçi sistemdən ancaq identifikasiya olunduqdan (login) sonra istifadə edə bilər. Qonaq (guest) girişi yoxdur.
2. **Söhbətin Yaradılması:** İstifadəçi yeni söhbət (chat) başlatdıqda frontend-dən backend-ə müraciət gedir və Supabase-də `chat_sessions` cədvəlində yeni sessiya yaradılır.
3. **Mesajların İdarə Edilməsi:** İstifadəçi mesaj yazarkən dərhal `chat_messages` cədvəlinə əlavə edilir (Supabase).
4. **Süni İntellekt Dəstəyi (N8n & Gemini):** Back-end API (`/api/chat/route.ts`) n8n üzərində olan webhook-a və ya Google Generative AI servisinə müraciət edir.
5. **Cavabın Geri Qayıtması:** Alınan qənaətbəxş cavab məlumat bazasında idarə edilərək (bot rollu mesaj) həm DB-yə əlavə olunur, həm də React daxilində "optimistic update" funksionallığı sayəsində istifadəçinin ekranında dərhal göstərilir.

## 3. Proseslərin Ardıcıllığı (Sequence of Operations)

1. **Frontend (UI) Prosesi:** 
   - İstifadəçi interfeysi (`src/app` və komponentlər) işə düşür.
   - `src/hooks/useChat.ts` hook-u Supabase client-i vasitəsilə əvvəlki söhbətləri və sessiyaları bazadan asinxron olaraq oxuyub ekrana gətirir.

2. **Backend API Çeklimi:**
   - İstifadəçi tərəfindən yazılan yeni mesaj `/api/chat/route.ts` API uç nöqtəsinə (endpoint-ə) göndərilir.
   - `supabase.auth.getUser()` ilə müraciət edən şəxsin eyniləşdirilməsi təsdiqlənir.

3. **Database (Verilənlər Bazası):**
   - Əlaqəli Cədvəllər vasitəsilə mesaj `chat_messages` içinə yazılır.
   - İzlənmə üçün avtomatik `updated_at` triggerləri işləyir. Yalnız icazəsi olan hesab (RLS) öz mesajlarını görür.

4. **Kənar Xidmət Emalı (N8n / Gemini):**
   - API tərəfindən N8n platformasına webhook göndərilir. İş axını (workflow) tələb olunan suala cavab formalaşdırır (Süni intellekt, məlumat bazasından sorğulama və s.).

5. **Geri Çevrilmə və Göstərmə:**
   - Botdan cavab bitdikdə eyni ardıcıllıqla cavab bazada yadda saxlanılır, State yenilənir və istifadəçi ekranında nəticə göstərilir.

## 4. İstifadə Edilən Alətlər (Tools & Libraries)

- **Next.js (v16.1.6):** Bütün tətbiqin həm frontend həm backend API hissələrinin qurulduğu əsas React framework. SSR (Server-Side Rendering) edə bilir və sürətli idarəetmə təmin edir.
- **React (v19.2):** Komponentlərin (düymələr, söhbət qutusu kimi) təkrarlana bilən şəkildə yazılması və istifadəçi interfeysinin render edilməsi üçündür.
- **TypeScript:** JavaScript-in daha etibarlı versiyası. Kod xətalarından yayınmaq, xüsusən API-lərin göndərdiyi məlumatların növünü (`types/interfaces`) düzgün idarə etmək üçündür.
- **Supabase SSR / Supabase-JS:** Layihənin əsas serverless verilənlər bazası və istifadəçi giriş (auth) sistemidir. `@supabase/ssr` paketi xüsusi olaraq Next.js üçün nəzərdə tutulub.
- **Tailwind CSS (v4):** Minimum CSS yazaraq klass adları vasitəsilə dizaynların yaradılmasını təmin edən utilitar CSS freymvorku.
- **Radix UI (`@radix-ui/react-*`):** Tətbiqin düymələri, tooltip-ləri, tabsları, dioloq (modal) və xəbərdarlıq pəncərələrini hazırlamaq üçün istifadə olunan başlıqsız (headless), ancaq əlçatanlığı (accessibility) olan komponent kitabxanası.
- **N8n:** Botun və webhookların əməliyyat axınını (workflow) dizayn edib idarə etmək üçün istifadə olunan vizual avtomatlaşdırma aləti.
- **Google Generative AI:** Google-un Gemini modeli ilə birbaşa əlaqə yaradaraq istifadəçinin verdiyi sualları anlamaq, analiz etmək və təbii dildə cavab yaratmaq üçün SDK.
- **Framer Motion (`framer-motion`):** Tətbiqə axıcı animasiyalar və dizayn elementləri əlavə etmək üçündür. UI/UX cəlbediciliyini artırır.
- **Zod:** Form-ları, istifadəçi girişlərini və API sorğularının qanuniliyini/tiplərini yoxlayan kitabxanadır (Validation). Şifrələmə, format limitləmə işini asanlaşdırır.
- **React-Markdown / remark-gfm:** AI tərəfindən göndərilən markdown (Məs. Cədvəllər, qalın yazılar, kod blokları) formatındakı yazıları React mühitində HTML olaraq təmiz render etmək üçündür.
- **Lucide-React:** Veb interfeysində SVG ikonlarını rahat komponent şəklində istifadə etməyə yarayan kitabxana.
- **Bot Təhlükəsizlik Panelləri (React Turnstile / Recaptcha):** Tətbiqin kənar zərərli skriptlərdən (spamlardan) qorunması məqsədilə Cloudflare Turnstile və Google reCaptcha v3 kitabxanaları istifadə edilir.
