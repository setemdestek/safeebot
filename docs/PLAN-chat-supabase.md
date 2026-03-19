# /plan - Chat Söhbətlərinin Supabase ilə İdarə Edilməsi

Bu plan istifadəçinin chat tarixçəsini və sessiyalarını **Supabase / PostgreSQL** üzərində, **Əlaqəli Cədvəllər (Relational Tables)** yanaşması ilə idarə etmək üçündür. Qonaq (Login olmadan) istifadəyə icazə verilmir.

## Proposed Changes

### Database Structure
Aşağıdakı Supabase miqrasiya SQL skripti yazılacaq (`supabase/migrations/` daxilində və ya UI üzərindən icra ediləcək):
- İki cədvəl: `chat_sessions` və `chat_messages`
- RLS siyasətlərinin qurulması (İstifadəçilər yalnız öz məlumatlarını görə və dəyişə bilər)
- Avtomatik `updated_at` trigger-ləri.

### Backend API (`src/app/api/chat/route.ts`)
- `supabase.auth.getUser()` ilə müraciət edənin eyniləşdirilməsi.
- İstəkdə yeni sessiya ID gələrsə / gəlməzsə uyğun olaraq yeni sessiyanın `chat_sessions`-a əlavə edilməsi.
- İstifadəçi tərəfindən gələn mesajın `chat_messages`-a insert (daxil) edilməsi.
- N8n Webhook-a müraciət edildikdən və cavab alındıqdan dərhal sonra botun mesajının da `chat_messages`-a daxil edilməsi.

### Frontend Hooks and UI (`src/hooks/useChat.ts` and `src/lib/session.ts`)
- `localStorage` əsaslı yükləmə və qeydetmə məntiqlərinin hamısı silinməlidir.
- Tətbiq qoşularkən (mount) köhnə söhbətlərin Supabase client vasitəsilə `chat_sessions`-dən oxunulması.
- Söhbət dəyişikliklərinin (yeni əlavə, silinmə) asinxron API sorğuları ilə əvəzlənməsi.
- Real-vaxt istifadəçi təcrübəsini təmin etmək üçün "optimistic updates" qorunacaq.

## Verification Plan

### Manual Verification
- İstifadəçi paneli tamamilə giriş edilmiş (login) halda açılır.
- "Yeni Söhbət" başladılır və ilk mesaj yazılır → Supabase Dashboard-da `chat_sessions` və `chat_messages` cədvəllərində yeni sətirlərin yarandığı gözlənilir.
- N8n bot-u cavab verdikdə yenə `chat_messages`-də "bot" rollu bir sətrin əlavə olunduğu yoxlanılır.
- Pəncərə `F5` edilib (Refresh) yenilənirsə, əvvəlki söhbətin eynilə qaldığı görünür.
- Başqa bir hesab fərqli e-mail ilə açılaraq test edildikdə, birinci istifadəçinin söhbətlərinin ikinciyə OLMADIĞI qəti surətdə təsdiqlənir.

## Təxmini Zamanlama
2 - 3 Saat.
