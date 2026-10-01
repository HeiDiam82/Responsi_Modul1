-- API-Perpustakaan schema
-- Jalankan di Supabase Dashboard > SQL Editor > New query > RUN
-- Project: API-Perpustakaan

create extension if not exists "pgcrypto";

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  kode text unique,
  judul text not null,
  penulis text,
  penerbit text,
  tahun_terbit integer,
  stok integer default 0,
  created_at timestamptz default now()
);

create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  book_id uuid references books(id) on delete cascade,
  tanggal_pinjam date default CURRENT_DATE,
  tanggal_kembali date,
  status text default 'Dipinjam' check (status in ('Dipinjam','Dikembalikan','Terlambat')),
  created_at timestamptz default now()
);

-- Agar anon key bisa akses via REST (seperti contoh modul Sales-API)
alter table members disable row level security;
alter table books disable row level security;
alter table loans disable row level security;
