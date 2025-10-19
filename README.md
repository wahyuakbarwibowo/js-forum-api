# Forum API V2

Proyek ini merupakan implementasi dari **Forum API V2 Submission** pada kelas **Belajar Fundamental Aplikasi Back-End** dari Dicoding Academy.  
Aplikasi ini dibangun menggunakan **Node.js** dan **Hapi Framework**, dengan fokus pada penerapan **Continuous Integration (CI)**, **Continuous Deployment (CD)**, **Limit Access (Rate Limiting)**, serta dukungan **HTTPS** untuk keamanan komunikasi data.

---

## 🚀 Fitur Utama

### 1. Continuous Integration (CI)
- Menggunakan **GitHub Actions** untuk menjalankan pengujian otomatis (Unit, Integration, dan Functional Test).
- CI dijalankan pada setiap event **pull request** ke branch utama (`main`).
- Terdapat minimal dua proses CI:
  - ✅ Satu skenario berhasil.
  - ❌ Satu skenario gagal.

### 2. Continuous Deployment (CD)
- Proses deployment otomatis ke server (contohnya AWS EC2) menggunakan **GitHub Actions**.
- Deployment dijalankan setiap ada **push ke branch utama**.
- Dapat menggunakan **SSH Action (appleboy/ssh-action)** atau layanan deployment lainnya.

### 3. Limit Access (Rate Limiting)
- Resource `/threads` dan seluruh path di dalamnya dibatasi hingga **90 request per menit**.
- Konfigurasi pembatasan diterapkan melalui **NGINX**.
- File konfigurasi disertakan pada root proyek dengan nama **`nginx.conf`**.

### 4. HTTPS
- API dapat diakses menggunakan protokol **HTTPS**.
- URL Forum API:  
  > https://your-domain-or-subdomain.xyz

---

## 🧩 Fitur Opsional (Bonus)
- Menyukai dan batal menyukai komentar thread melalui endpoint:
  ```http
  PUT /threads/{threadId}/comments/{commentId}/likes
  ```
- Response:
  ```json
  {
    "status": "success"
  }
  ```
- Setiap komentar menampilkan jumlah suka (`likeCount`) pada response detail thread.

---

## 🧪 Pengujian

### Pengujian Otomatis
- Menggunakan **Postman Collection & Environment** yang disediakan oleh Dicoding.
- Mendukung pengujian berurutan menggunakan **Postman Collection Runner**.

### Pengujian Lokal
Untuk menjalankan pengujian secara lokal:

```bash
# Install dependencies
npm install

# Menjalankan pengujian
npm test
```

> Pastikan environment testing sudah dikonfigurasi dengan benar (`.env.test`) dan database PostgreSQL test tersedia.

---

## ⚙️ Cara Menjalankan Aplikasi

### Persiapan
1. Pastikan **Node.js versi LTS v22** terpasang.
2. Siapkan database PostgreSQL.
3. Buat file `.env` berdasarkan template berikut:

```env
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=forum_api
PGPORT=5432

ACCESS_TOKEN_KEY=youraccesstokenkey
REFRESH_TOKEN_KEY=yourrefreshtokenkey
ACCESS_TOKEN_AGE=3600
```
4. Jalankan migrasi dan seed data jika diperlukan.

### Menjalankan Server

```bash
npm run start
```

Server akan berjalan di `http://localhost:5000` (atau sesuai konfigurasi environment).

---

## 🧰 Teknologi yang Digunakan
- **Node.js (v22 LTS)**
- **Hapi Framework**
- **PostgreSQL**
- **pg-promise**
- **Jest** untuk pengujian
- **ESLint** untuk menjaga kualitas kode
- **GitHub Actions** untuk CI/CD
- **NGINX** untuk reverse proxy & rate limiting

---

## 📦 Struktur Proyek

```
├── src/
│   ├── Applications/
│   ├── Domains/
│   ├── Infrastructures/
│   ├── Interfaces/
│   └── server.js
├── tests/
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
├── nginx.conf
├── package.json
├── .env.example
└── README.md
```

---

## 🔒 Keamanan
- Mendukung **autentikasi JWT (Access & Refresh Token)**.
- Semua endpoint sensitif dilindungi oleh **Access Token**.
- API hanya dapat diakses melalui **HTTPS**.

---

## 📑 Catatan Submission
- CI dan CD berhasil dijalankan di GitHub Actions.
- Rate limiting diterapkan menggunakan NGINX (file `nginx.conf`).
- Deployment otomatis berhasil pada push ke branch `main`.
- API dapat diakses menggunakan HTTPS.
- Repository bersifat **publik** sesuai ketentuan submission.

---

## 🧠 Lisensi
Proyek ini dikembangkan untuk tujuan pembelajaran dan submission Dicoding Academy.  
Dilarang memperbanyak, memodifikasi, atau menyebarkan ulang proyek ini tanpa izin.

---

**Dibuat dengan ❤️ oleh [Nama Anda]**
