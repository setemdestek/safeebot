# 🚀 SafeeBot — Environment Variables & API Resources

Bu sənəd **SafeeBot** layihəsində istifadə olulan bütün mühit dəyişənlərini, API-ları, Webhook-ları və onların təyinatlarını əhatə edir.

---

## 🔍 Ümumi Baxış (Tech Stack)
*   **Frontend/Backend:** Next.js 16+ (App Router)
*   **Database & Auth:** Supabase
*   **Automation/AI Integrations:** n8n
*   **Security:** Google reCAPTCHA v3

---

## 🌐 n8n Webhook-lar
Süni intellekt və avtomatlaşdırma n8n üzərindən idarə olunur.

| Dəyişən Adı | Təsvir | Təhlükəsizlik |
| :--- | :--- | :--- |
| `WEBHOOK_URL` | Əsas chat botunun n8n üzərindəki webhook ünvanı. | **Server-side only** |
| `JSA_WEBHOOK_URL` | İş Təhlükəsizliyi Analizi (JSA) üçün istifadə olunan xüsusi webhook. (Yoxdursa `WEBHOOK_URL`-ə qayıdır) | **Server-side only** |

---

## ⚡ Supabase Konfiqurasiyası
Layihənin bütün verilənlər bazası və istifadəçi girişləri Supabase üzərindədir.

| Dəyişən Adı | Təsvir | Məkan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase layihəsinin ana URL-i. | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Brauzer üçün nəzərdə tutulmuş ictimai açar. | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin səviyyəli gizli açar. **HƏMİŞƏ GİZLİ SAXLA!** | **Server-side only** |

---

## 🛡️ Google reCAPTCHA v3
Platformanı botlardan qorumaq üçün istifadə olunur.

| Dəyişən Adı | Təsvir | Defolt Qiymət |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Brauzerdə reCAPTCHA widgeti üçün istifadə olunan açar. | - |
| `RECAPTCHA_SECRET_KEY` | Serverdə tokeni yoxlamaq üçün istifadə olunan gizli açar. | - |
| `RECAPTCHA_MIN_SCORE` | Keçid üçün tələb olunan minimum xal (0.0 - 1.0). | `0.3` |

---

## ⚙️ Digər Parametrlər

### 1. Fayl Limitləri (JSA)
*   **Maksimum Şəkil Həcmi:** 10MB (Client və Server səviyyəsində yoxlanılır).
*   **Maksimum Şəkil Sayı:** 1 ədəd (Analiz üçün).

### 2. Timeouts
*   **n8n Webhook Timeout:** 120 saniyə (120,000 ms).
*   **Chat Timeout:** 300 saniyə (5 dəqiqə).

### 3. Supabase RPC Funksiyaları
*   `check_jsa_limits(p_user_id)`: İstifadəçinin analiz limitini yoxlayır.

---

## 📦 Fayl strukturu
Layihədə bu dəyişənlər aşağıdakı fayllarda saxlanılır:
*   `.env.local` — Lokal inkişaf üçün (local development).
*   `.env.production` — Canlı server üçün (production).
*   `.env.production.example` — Yeni deploy-lar üçün nümunə.

---
> [!IMPORTANT]
> Heç bir `.env` (şablonlar istisna olmaqla) faylı Git-ə (Github/Gitlab) göndərilməməlidir (onlar `.gitignore` siyahısındadır).
