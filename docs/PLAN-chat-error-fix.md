# Xətanın Kök Səbəbi (Root Cause Analysis)

**Xəta simptomu:** Chat səhifəsində "Bağlantı xətası" və ya API üzərindən `/api/chat` müraciəti zamanı `500 Internal server error` xətası yaranır.
**Hipotez və tapıntılar:** Son saat ərzində biz `WEBHOOK_URL` yenilədik, `sessionsId`-nin UUID validasiyasını ləğv etdik, API xətalarının səbəbini görmək üçün loqlar əlavə etdik və yeni `safebot` Docker imicini build (inşa) etdik. Lakin, arxa planda 3001-ci portu dinləyən sistem **5 saat əvvəl başladılmış** `safebotproje-safebot-1` adlı köhnə Docker konteyneridir. Buna görə də, sizin veb brauzeriniz yeni yazılmış, dəyişdirilmiş koda deyil, həmin köhnə - xətalı konteynerin koduna müraciət edir.

## Həll Planı

Aşağıdakı addımlarla köhnə konteyneri dayandırıb yenisini işə salacağıq.

### Sübut

Serverdə hazırda işləyən konteynerlər siyahısında görünür:
- ID: `979849612cbd`
- Adı: `safebotproje-safebot-1` 
- Statusu: `Up 5 hours` (5 saatdır işləyir)
- Port: `0.0.0.0:3001->3001/tcp`

---

## Təklif Olunan Addımlar

### Addım 1: Köhnə Konteyneri Dayandırmaq
- 3001-ci portu məşğul edən, köhnə kodları ehtiva edən `safebotproje-safebot-1` obyekti mütləq dayandırılmalıdır.
- Komanda: `docker stop safebotproje-safebot-1`

### Addım 2: Funsksiya yazılarkən nəzərə alınmalıdır
- Hər istifadəçi üçün unikal session ID yaradılmalıdır.
- Hər istifadəçinin öz mesajları yadda saxlanılmalıdır.
- Hər istifadəçinin öz söhbətləri yadda saxlanılmalıdır.
- Bütün kodlar düzgün yazılmalıdır.
- Bütün funksiyalar düzgün yazılmalıdır.
- Bütün kodlar yalnız öz funksiyalarını yerinə yetirməlidir.
- Əlavə konteyner yazılmalı deyil hamsı bir konteynerdə olmalıdır.


### Addım 3: Yeni İmicin (safebot) Tətbiq Edilməsi
- Əvvəlcədən uğurla `docker build -t safebot .` əmri ilə hazırladığımız və bütün düzəlişləri saxlayan yeni `safebot` imicini təkrar 3001-ci portla işə salmaq.
- Komanda: `docker run -d -p 3001:3001 --name safebot-app safebot`

### Addım 4: Serveri Test Etmək
- Yeni konteyner işə düşdükdən sonra brauzerdə səhifəni tamamilə yeniləmək (Ctrl+F5) və təkrar mesaj yazaraq yoxlamaq iddia etdiyiniz chat-a baxmaq.
