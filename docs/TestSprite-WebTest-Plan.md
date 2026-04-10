# SafeeBot Layihəsi üçün TestSprite Detallı Test Planı (Extra Testing Information)

Aşağıdakı məlumatlar **SafeeBot** platformasının başlanğıcından sonuna qədər bütün əsas funksionallıqlarını avtomatlaşdırılmış şəkildə test etmək üçün nəzərdə tutulub. TestSprite kimi test alətlərinə bu məlumatı təqdim edərək proqramın əhatəli test olunmasını təmin edə bilərsiniz.

## Ümumi Məlumat və Tətbiq Arxitekturası
- **Texnologiya:** Next.js (App Router), TailwindCSS, Supabase (Auth & Database), Framer Motion, next-intl (Çoxdillilik: `az`, `en`, `ru`).
- **Tətbiqin Məqsədi:** Əməyin mühafizəsi və texniki təhlükəsizlik (SƏTƏM / HSE) sahəsində süni intellekt dəstəklənən chatbot platforması, CV Builder və JSA (İş Təhlükəsizliyi Analizi) aləti.

---

Sayta giriş üçün istifadəçi adı: [f.beyin16@gmail.com] 
Şifrə: 1111111111A@?a

risk analizi üçün şəkil: C:\Users\Hesenov\Downloads\İNsAAT.jpg

CV Builder üçün şəkil: C:\Users\Hesenov\Downloads\EMMA.jpg

## Modul 1: Ana Səhifə (Landing Page) və İctimai Səhifələr
**URL:** `/` (Məsələn: `/az`)

* **Navbar və Footer:**
  - Naviqasiya çubuğu 스croll (aşağı düşdükcə) edildikdə fonun (backdrop-blur) aktivləşdirilməsinin yoxlanılması.
  - Dil (Language Selector) və Mövzu (Theme Toggle - Dark/Light) düymələrinin düzgün işləməsi.
  - Footer-də olan Məxfilik (Privacy) və Şərtlər (Terms) linklərinin müvafiq səhifələrə yönləndirməsi.
* **Hero Bölməsi:**
  - "Başla" (Login) və "Necə İşləyir" (scroll-to-section) düymələrinin fəaliyyəti.
* **Mənbələr banneri (Sources Banner):**
  - Mənbələr siyahısının "Marquee" effekti ilə sonsuz olaraq sürüşməsinin yoxlanılması (IOSH, NEBOSH, LOLER və s.).
* **Əlaqə:**
  - "Destek üçün e-poçt" (setemdestek@hotmail.com) bölməsindən `mailto:` linkinin çalışması.

---

## Modul 2: Autentifikasiya Paneli (Auth Flow)
**Diqqət:** Bütün formalarda (Login, Register) əlavə olaraq **Cloudflare Turnstile CAPTCHA** var. Testlər zamanı CAPTCHA bypass/mock edilməli və ya təsdiqlənmiş statusda təqlid edilməlidir.

* **Qeydiyyat (Register) - `/register`:**
  - Ad, Soyad boş olanda xəta verib-verməməsi.
  - E-poçt formatının (email@example.com) yoxlanılması.
  - Parolun gücünün validasiyası: Ən az 10 simvol, 1 böyük hərf, 1 kiçik hərf, rəqəm və xüsusi simvol (@$!%*?&) tələb edilir. (Məs: `TestPass123!`).
  - "Qaydalarla razılaşdım" (Terms Checkbox) işarələnməyəndə göndərişə icazə verilməməsi.
* **Daxil olma (Login) - `/login`:**
  - Səhv istifadəçi adı və parol daxil etdikdə xəta mesajının ("Daxil etdiyiniz e-poçt və ya şifrə yanlışdır") yoxlanılması.
  - Göz (Eye) ikonuna basıldıqda parolun görünməsi / gizlənməsi.
  - Uğurlu giriş zamanı `/dashboard/chat` səhifəsinə yönləndirmə.
* **Şifrəni Unutdum (Forgot Password) - `/forgot-password`:**
  - E-poçt daxil edildikdə "link göndərildi" mesaj paneli (Success State) çıxmasının yoxlanılması.

---

## Modul 3: Chatbot Paneli (Dashboard - Chat)
**URL:** `/dashboard/chat`

* **UI və Sidebar:**
  - Sol idarəetmə panelində (Sidebar) yeni chat yaratmaq düyməsi ("+ Yeni Chat").
  - Tarixçəyə əsasən (Bu gün, Dünən, Keçən həftə) sessiyaların qruplaşmasının görünməsi.
  - Chat adının dəyişdirilməsi (Rename) - Qələm ikonuna basıb editləyib "Enter" ilə təsdiqləmək.
  - Çatı silmə (Delete) prosesi.
* **Chat Area & Input (Mesajlaşma):**
  - Chat bölməsinə "Əməyin mühafizəsi nədir?" kimi test mesajı göndərilməsi.
  - `ChatInput` komponentinin içindəki Placeholder-in (yazı makinası effekti) fəaliyyəti.
  - Mesaj göndərildikdən sonra AI cavablandırarkən yüklənmə statusunun (LumaSpin) və skelet (Pulse) komponentinin çıxması.
  - Markdown, siyahı (Lists) və cədvəl (Table) ehtiva edən uzun formatlı cavabların render olunması; Yazı içərisində Kod bloklarının (`code`) üstündəki "Kopyala" düyməsinin işləməsi.

---

## Modul 4: HSE JSA Analizatoru (JSA Analyzer)
**Access:** Chat panelinin sol Sidebar-ında "HSE JSA Analizi" düyməsinə kliklənilməsi tətbiqi Modal şəklində açır.

* **Addım 1: Fayl yükləmə (DropZone)**
  - Sistemin şəkil formatını (Maksimum 1 şəkil) düzgün qəbul edib-etməməsi (Məsələn, .jpg, .png yüklənərkən `ImagePreviewGrid` hissəsində preview göstərilməsi).
  - Fayl silinməsi (Remove File) funksionallığının düzgün işləməsi.
* **Addım 2: Metadata Forması**
  - "İnspektorun adı", "İcra yeri", "Tarix", "Şirkət adı" kimi məlumatların daxil edilməsi.
  - Şəkil yüklənmədən və ya zəruri inputlar (Ad, Yer) dolmadan "JSA Hesabatı Hazırla" düyməsinin qeyri-aktiv (Disabled) olması.
* **Addım 3: Analiz Prosessi (ProgressTracker)**
  - Düyməyə basıldıqdan sonra mərhələlərin vizual olaraq dəyişməsi: "Şəkillər yüklənir..." -> "AI analiz edir..." -> "Risklər tapılır..." -> "PDF/Nəticə Hazırlanır...".
  - Uğurlu cavab olaraq sənədin yüklənilməsi (Məsələn: `JSA_Hesabat.pdf` və ya `.docx` formatında).

---

## Modul 5: CV Builder Aləti
**URL:** `/dashboard/cv`

CV Builder addımlarla təşkil olunub: Language -> Template -> Form.
* **Addım 1: Dil və Şablon Seçimi (`CVLanguageSelector`, `TemplateSelector`)**
  - CV-nin hansı dildə olacağını seçdikdən sonra şablonun (Professional, Creative vs) seçilməsi.
  - "Baxış" (Preview) düyməsinin `TemplatePreview` modalını açaraq indiki CV-ni vizuallaşdırması.
* **Addım 2: Çox Bölməli Forma Dolumu**
  - **PersonalInfo:** Ad, Soyad, Email, Doğum tarixi, Telefon, Şəhər (Məcburidir). Şəkil Yükləmə (PhotoUpload).
  - **AboutMe, WorkExperience, Education, Skills, Languages:** Hamısının əlavə edilib silinə bildiyinə (Add/Remove item) və forma məlumatlarının (Validation) işlədiyinə əmin olun. Əsas xətaların (Validation Errors) test edilməsi: "Ən az 1 iş təcrübəsi yazılmalıdır" vs.
* **Addım 3: AI Funksiyaları (Tabs: Analysis, ATS Score, Cover Letter)**
  - "Süni İntellektlə Analiz Et" (Search ikonlu) düyməsinə kliklədikdə Validasiya-nı keçməsi və Analiz, ATS Score panellərinin dolması.
  - ATS Skoru bar chart/ring komponentinin render olunması.
  - Cover Letter (Örtük məktubu) generik formalaşması.
* **Addım 4: Eksport (Generate)**
  - Bütün məlumatlar dolduqdan sonra "CV Yüklə" düyməsi ilə DOCX (Microsoft Word) faylının export edilməsi və faylın düzgün simvollarla adlanması (`CV_Ad_Soyad.docx`).
  - Draft (Yarımçıq qalan məlumatların saxlanması) sisteminin testi: Səhifəni refresh edəndə "Bərpa Et" (Restore) pəncərəsinin çıxması.

---

## Modul 6: Ayarlar (Settings)
**URL:** `/dashboard/settings`

* **Profil qabarıqları (Profile Tab):**
  - Şəxsi məlumatların (Ad, Soyad) dəyişdirilib "Saxla" düyməsinə klik edilməsi və "Profil yeniləndi" check yazısının görünməsi. (Email inputu `disabled` olmalıdır).
* **Təhlükəsizlik (Security Tab):**
  - Mövcud parol, Yeni parol və Yeni parolu təsdiqlə panellərinin işləməsi.
  - "Hesabı Sil" (Delete Account) əməliyyatı zamanı `showDeleteModal`-ın açılması və Warning (Təsdiqləmə) panelinin testi üzərindən əmin olmaq.
* **Tərcihlər (Preferences Tab):**
  - Platformanın dilinin (az/en/ru) real zamanlı dəyişdirilməsi və Routing ilə UI-da anlıq olaraq tətbiq olunması.
  - Açık/Tünd (Light/Dark Mode) `ThemeToggle` seçiminin düzgün çalışması.

---

## Test Xətaları Gözləntiləri (Edge Cases)
1. Bütün Form API sorğuları (Form submissions) zamanı saxta, çox uzun (5000+ simvol) mətni məhdudlaşdıran input limitlərinin testi.
2. Token müddəti bitdikdə `middleware.ts` yönləndirmələrinin (Redirects to `/login`) işə düşməsi.
3. n8n mühərriki ilə əlaqəli Server xətası olduqda "Bilinməyən xəta baş verdi" (Network error fallback) mesajının UI-də (ChatArea-da qırmızı rəngdə və ya alert şəklində) görünməsi. 
