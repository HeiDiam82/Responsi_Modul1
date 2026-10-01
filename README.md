# API-Perpustakaan

REST API sederhana untuk layanan pencatatan peminjaman buku perpustakaan.

Stack: **Node.js + Express.js + Supabase (PostgreSQL)**. Siap deploy ke **Vercel**.

Responsi Modul 1 – Application Programming Interface (API).
Adaptasi dari contoh `Sales-API` di modul (categories / customers / products) menjadi domain perpustakaan (members / books / loans).

## Tujuan

- Mengimplementasikan arsitektur RESTful API dengan benar untuk mengelola data peminjaman.
- Membuat server backend Node.js + Express untuk mengelola request / response.
- Menghubungkan backend ke Supabase sebagai Backend-as-a-Service.
- Memisahkan logika ke `model`, `controller`, `router` agar terorganisir.
- Menghasilkan API rapi, pakai environment variable, siap deploy.

## Fitur

- CRUD Anggota (`/api/members`)
- CRUD Buku (`/api/books`)
- CRUD Peminjaman (`/api/loans`)
- Filter query peminjaman, contoh:
  - `GET /loans?status=Terlambat`
  - `GET /loans?status=Dipinjam`
  - `GET /loans?member_id=<uuid>`
  - `GET /loans?book_id=<uuid>`
- Join otomatis: `GET /loans` menampilkan relasi `members` + `books`.

## Struktur Proyek

```
Responsi_Modul1/
├── src/
│   ├── config/supabaseClient.js
│   ├── models/
│   │   ├── memberModel.js
│   │   ├── bookModel.js
│   │   └── loanModel.js
│   ├── controllers/
│   │   ├── memberController.js
│   │   ├── bookController.js
│   │   └── loanController.js
│   ├── routes/
│   │   ├── memberRoutes.js
│   │   ├── bookRoutes.js
│   │   └── loanRoutes.js
│   └── index.js
├── supabase-schema.sql
├── vercel.json
├── .env.example
└── package.json
```

## Struktur Data / Schema

SQL lengkap: lihat `supabase-schema.sql`. Sudah dijalankan di Supabase project `API-Perpustakaan`.

### members

| kolom | tipe | ket |
|---|---|---|
| id | uuid PK default gen_random_uuid() | - |
| name | text NOT NULL | nama anggota |
| email | text | - |
| phone | text | - |
| address | text | - |
| created_at | timestamptz default now() | - |

### books

| kolom | tipe | ket |
|---|---|---|
| id | uuid PK default gen_random_uuid() | - |
| kode | text UNIQUE | ex: BK-001 |
| judul | text NOT NULL | - |
| penulis | text | - |
| penerbit | text | - |
| tahun_terbit | integer | - |
| stok | integer default 0 | - |
| created_at | timestamptz default now() | - |

### loans

| kolom | tipe | ket |
|---|---|---|
| id | uuid PK default gen_random_uuid() | - |
| member_id | uuid FK → members(id) ON DELETE CASCADE | - |
| book_id | uuid FK → books(id) ON DELETE CASCADE | - |
| tanggal_pinjam | date default CURRENT_DATE | - |
| tanggal_kembali | date | jatuh tempo / tgl kembali |
| status | text default 'Dipinjam', check in ('Dipinjam','Dikembalikan','Terlambat') | dipakai untuk filter |
| created_at | timestamptz default now() | - |

## Contoh Request & Response

Base URL lokal: `http://localhost:3000`
Base URL produksi: `https://<nama-project>.vercel.app` (isi setelah deploy, lihat bagian Deployment)

### Health check

```
GET /
```

Response:

```json
{
  "message": "API-Perpustakaan running",
  "endpoints": ["/api/members", "/api/books", "/api/loans", "/api/loans?status=Terlambat"]
}
```

### Members

Buat anggota:

```
POST /api/members
Content-Type: application/json

{
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "phone": "08123456789",
  "address": "Jl. Merdeka No.10, Jakarta"
}
```

Response `201`:

```json
{
  "id": "6fac00d1-ea99-46d7-9baf-4416c9cee0ed",
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "phone": "08123456789",
  "address": "Jl. Merdeka No.10, Jakarta",
  "created_at": "2026-10-01T07:03:25.796196+00:00"
}
```

Lainnya:

```
GET    /api/members
GET    /api/members/:id
PUT    /api/members/:id
DELETE /api/members/:id
```

### Books

```
POST /api/books
Content-Type: application/json

{
  "kode": "BK-001",
  "judul": "Laskar Pelangi",
  "penulis": "Andrea Hirata",
  "penerbit": "Bentang Pustaka",
  "tahun_terbit": 2005,
  "stok": 10
}
```

Response `201`:

```json
{
  "id": "4cc01a6a-79d8-44b5-b3dc-c83f28af92c0",
  "kode": "BK-001",
  "judul": "Laskar Pelangi",
  "penulis": "Andrea Hirata",
  "penerbit": "Bentang Pustaka",
  "tahun_terbit": 2005,
  "stok": 10,
  "created_at": "2026-10-01T07:03:26.359856+00:00"
}
```

Lainnya:

```
GET    /api/books
GET    /api/books/:id
PUT    /api/books/:id
DELETE /api/books/:id
```

### Loans (inti responsi)

Buat peminjaman:

```
POST /api/loans
Content-Type: application/json

{
  "member_id": "6fac00d1-ea99-46d7-9baf-4416c9cee0ed",
  "book_id": "4cc01a6a-79d8-44b5-b3dc-c83f28af92c0",
  "tanggal_pinjam": "2026-10-01",
  "tanggal_kembali": "2026-10-08",
  "status": "Dipinjam"
}
```

Response `201`:

```json
{
  "id": "3f86bca7-c44e-4146-b266-7f792e662523",
  "member_id": "6fac00d1-ea99-46d7-9baf-4416c9cee0ed",
  "book_id": "4cc01a6a-79d8-44b5-b3dc-c83f28af92c0",
  "tanggal_pinjam": "2026-10-01",
  "tanggal_kembali": "2026-10-08",
  "status": "Dipinjam",
  "created_at": "2026-10-01T07:03:33.194932+00:00"
}
```

Ambil semua + join:

```
GET /api/loans
```

Response `200`:

```json
[
  {
    "id": "3f86bca7-c44e-4146-b266-7f792e662523",
    "member_id": "6fac00d1-ea99-46d7-9baf-4416c9cee0ed",
    "book_id": "4cc01a6a-79d8-44b5-b3dc-c83f28af92c0",
    "tanggal_pinjam": "2026-10-01",
    "tanggal_kembali": "2026-10-08",
    "status": "Terlambat",
    "created_at": "2026-10-01T07:03:33.194932+00:00",
    "members": {
      "id": "6fac00d1-ea99-46d7-9baf-4416c9cee0ed",
      "name": "Budi Santoso",
      "email": "budi@email.com"
    },
    "books": {
      "id": "4cc01a6a-79d8-44b5-b3dc-c83f28af92c0",
      "kode": "BK-001",
      "judul": "Laskar Pelangi",
      "penulis": "Andrea Hirata"
    }
  }
]
```

Filter (wajib ada di responsi):

```
GET /api/loans?status=Terlambat
GET /api/loans?status=Dipinjam
GET /api/loans?status=Dikembalikan
GET /api/loans?member_id=<uuid>
GET /api/loans?book_id=<uuid>
```

Update status:

```
PUT /api/loans/:id
Content-Type: application/json

{
  "status": "Terlambat"
}
```

Hapus:

```
DELETE /api/loans/:id
```

→

```json
{ "message": "Loan deleted successfully" }
```

## Panduan Instalasi & Menjalankan Lokal

Prasyarat: Node.js 18+, akun Supabase.

1. Clone repo:

```bash
git clone <url-repo-kamu>
cd Responsi_Modul1
```

2. Install:

```bash
npm install
```

3. Buat tabel di Supabase:
   - Buka Supabase Dashboard project `API-Perpustakaan` → SQL Editor → New query
   - Paste isi `supabase-schema.sql` → RUN

4. Isi kredensial:

```bash
cp .env.example .env
```

Isi `.env`:

```
SUPABASE_URL=https://bxxjelhtzrzgoysyzxzp.supabase.co
SUPABASE_KEY=<anon-public-key>
PORT=3000
```

Ambil dari: Supabase Dashboard → Project Settings → Data API → Project URL, dan API Keys → anon public key.

5. Jalankan:

```bash
npm run dev
# atau
npm start
```

Server: `http://localhost:3000`. Uji dengan Postman / curl sesuai contoh di atas.

## Deployment (Vercel)

`vercel.json` sudah disediakan:

```json
{
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }]
}
```

Langkah deploy (mirip Percobaan 2 di modul):

1. Push proyek ke GitHub.
2. Buka https://vercel.com → Add New → Project → Import repo.
3. Framework terdeteksi Node.js, Root Directory sesuai lokasi kode.
4. Tambah Environment Variables:
   - `SUPABASE_URL` = Project URL Supabase
   - `SUPABASE_KEY` = anon key Supabase
5. Klik Deploy → tunggu build → dapat URL publik → Visit.
6. Verifikasi: buka `<url-vercel>/` dan `<url-vercel>/api/loans` di browser / Postman, pastikan JSON dari Supabase muncul.
7. Tempel URL publik di bawah dan di pengumpulan tugas.

### Link hasil deployment

```
https://<nama-project>.vercel.app
```

> Ganti dengan URL Vercel kamu setelah deploy. Contoh verifikasi lokal sudah lolos: `GET /`, `POST /api/members`, `POST /api/books`, `POST /api/loans`, `GET /api/loans?status=Terlambat`, `PUT /api/loans/:id`, `DELETE`.

## Catatan

- `.env` jangan di-commit (sudah ada di `.gitignore`). Di Vercel pakai Environment Variables.
- Status `loans.status` dibatasi `Dipinjam | Dikembalikan | Terlambat` via CHECK constraint.
- Struktur MVC mengikuti contoh modul agar mudah dinilai.
