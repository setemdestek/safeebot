# /plan: Authentication Fixes 

## 1. Məsələnin Analizi
- **reCAPTCHA Xətası**: Hazırda sistemdə **reCAPTCHA v3 (Görünməz)** istifadə edilir. V3 üçün düymə və ya tık (checkbox) olmur, o bunu arxa planda təkbaşına yoxlayır və xal verir. `localhost` mühitində hesabladığı "təhlükəsizlik xalı" aşağı olduğu üçün sistem API-də "Robot olmadığınızı təsdiqləyin" səhvini çıxararaq daxil olmanı bloklayır, ancaq istifadəçi bu təsdiqi manual edə bilmir.
- **Supabase İşləkliyi**: `supabase` serverinə bağlantı `.env.local`-da verilib və aktiv görünür, login/register zamanı birbaşa serverlə əlaqə qurulur.
- **Şifrəni Unutmuşam**: İndiyə qədər həmin düymə sadəcə xəbərdarlıq (`alert()`) çıxarırdı. Onu real idarəemə səhifəsi ilə inteqrasiya edib, Supabase üzərindən şifrə sıfırlama (Reset Password) məntiqi yığılmalıdır.

## 2. İcra Planı (Addım-addım)

### Addım 1: reCAPTCHA Görünüşünün Nəzərdən Keçirilməsi (Təxmini vaxt: 15 dəq)
- **Problem**: V3 üçün Checkbox-un olmaması və Localhost-da keçməməsi.
- **Həll**: Sizə görə iki yoldan biri seçilə bilər:
  - **A variantı**: V3 arxitekturasını saxlamaq, lakin test/developer mühitində (localhost) zəif xal reytinqini (score < 0.5) aradan qaldıraraq bypass etmək və ya daha elastik etmək.


### Addım 2: Supabase Xidmətlərini Yoxlamaq və Təmin Etmək (Təxmini vaxt: 5 dəq)
- Lokal `.env.local` açarları ilə Supabase bağlantı və Auth xidmət statusunun son bir daha test edilib təsdiqlənməsi.

### Addım 3: Şifrə Unutma Axınının (Flow) Tam Qurulması (Təxmini vaxt: 25 dəq)
- `src/app/[locale]/forgot-password/page.tsx` - Email istəyən gözoxşayan yeni premium səhifə yaradılacaq.
- Form daxilində Supabase-in `resetPasswordForEmail` funksionallığı aktiv ediləcək və istifadəçinin mail ünvanına sorğu göndəriləcək.
- `src/app/[locale]/update-password/page.tsx` - Mail-ə gələn linkdən daxil olduqda yeni şifrə təyin edilməsi üçün təhlükəsiz səhifə hazırlanacaq.
- `/login` səhifəsində mövcud olan "Şifrəmi unutmusunuz?" düyməsi real `href="/az/forgot-password"` linkinə yönləndiriləcək.

## 3. Qarşılıqlı Asılılıqlar 
- Şifrə sıfırlama (Email) göndərilməsi üçün Supabase Dashboard-dan **Redirect URL** (localhost:3000 və ya 3001) düzgün tənzimləndiyinə əmin olmalıyıq.

 

