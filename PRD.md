# Product Requirements Document (PRD): JejakKarier

**Version:** 1.0.0 (MVP)  
**Status:** Approved for Vibe Coding  
**Primary Stack:** Next.js 16, Shadcn UI, Tailwind CSS, Zustand, TanStack Query v5, Supabase (Auth, RLS, Database)  
**Design System:** Linear-style (Minimalist, Dark Mode Default, Keyboard-first)

---

## 1. Executive Summary

**JejakKarier** adalah aplikasi manajemen _pipeline_ lamaran kerja yang dirancang khusus untuk _developer_ dan profesional. Aplikasi ini mengatasi masalah "lupa _follow-up_" dan ketidakteraturan dalam mencari kerja dengan mengubah sistem pelacakan pasif menjadi asisten proaktif. Fitur utamanya mencakup antarmuka Kanban yang _snappy_, pelacakan "Ghosting" otomatis, dan ekstraksi data cerdas.

---

## 2. Core Features (Minimum Viable Product)

### 2.1. Authentication & Security

- **Social Auth:** Pengguna dapat mendaftar/masuk dengan mulus menggunakan Google OAuth (via Supabase Auth).
- **Data Isolation:** Implementasi _Row Level Security_ (RLS) di Supabase untuk memastikan pengguna hanya dapat membaca, mengubah, dan menghapus data lamaran mereka sendiri.

### 2.2. Smart Job Pipeline (Kanban & List View)

- **View Modes:** Toggle instan antara tampilan Kanban (berbasis kolom) dan List (berbasis tabel baris).
- **Kanban Columns:** _Wishlist_, _Applied_, _Assessment/Test_, _Interview_, _Offered_, _Rejected_.
- **Drag-and-Drop:** Memindahkan kartu lamaran antar kolom dengan pembaruan status instan (_Optimistic UI_ via TanStack Query).
- **Smart URL Parser (AI-Ready):** Input berupa URL lowongan (LinkedIn, Jobstreet, dll) atau teks biasa akan di- _parse_ untuk mengisi form secara otomatis (Nama Perusahaan, Posisi, Rentang Gaji). _Catatan: Versi MVP bisa dimulai dengan manual input yang dioptimasi untuk keyboard._

### 2.3. Proactive "Ghosting" Monitor

- **Decaying Status:** Jika sebuah kartu lamaran berada di kolom yang sama (terutama _Applied_ atau _Interview_) selama lebih dari 10-14 hari tanpa _update_, kartu tersebut akan mendapatkan indikator visual (misal: _subtle red border_ atau ikon peringatan).
- **Follow-up Action:** Tombol _quick-action_ di dalam kartu untuk menandai bahwa pengguna telah melakukan _follow-up_ ke HRD.

### 2.4. Job Card Details (Detail Lamaran)

Klik pada kartu lamaran akan membuka _modal/slide-over_ yang berisi:

- **Metadata:** Nama Perusahaan, Role, Tipe Pekerjaan (Remote/Hybrid/WFO), Lokasi, Gaji, URL Referensi.
- **Timeline/Activity Log:** Riwayat tanggal kapan lamaran dibuat dan kapan statusnya berubah.
- **Private Notes:** Teks editor sederhana (Markdown support) untuk mencatat poin wawancara, profil HRD, atau tugas _live-code_.

### 2.5. Minimalist Analytics Dashboard

- **Conversion Funnel:** Visualisasi sederhana (seperti _progress bar_ atau _funnel chart_) yang menunjukkan rasio keberhasilan dari _Applied_ ➔ _Interview_ ➔ _Offered_.
- **Weekly Activity:** Grafik batang kecil yang menunjukkan jumlah lamaran yang dikirim per minggu untuk menjaga konsistensi.

---

## 3. Technical Architecture

- **Frontend Framework:** Next.js 16 (App Router). Menggunakan _Server Components_ secara _default_, dan _Client Components_ hanya untuk interaksi UI kompleks (seperti _Drag-and-drop_ dan form dinamis).
- **State & Data Fetching:** Zustand & TanStack Query (v5). Digunakan secara eksklusif untuk mutasi data (_update_ status, tambah lamaran) dan _caching_. Wajib menggunakan _Optimistic Updates_ pada interaksi Kanban.
- **Styling:** Tailwind CSS dikombinasikan dengan Shadcn UI.
- **Backend & DB:** Supabase (PostgreSQL). Menangani Autentikasi, Database, dan _Realtime subscriptions_ (jika diperlukan untuk sinkronisasi antar perangkat).

---

## 4. UI/UX & Design Guidelines (Linear Style)

Sistem wajib mengikuti prinsip desain **Linear-style** secara ketat:

- **Color Palette:** _Deep dark theme_. Background dominan `#09090b` (zinc-950). Teks utama putih/abu-abu terang (`zinc-100`), teks sekunder abu-abu redup (`zinc-400`).
- **Borders & Shadows:** Sangat minimalis. Gunakan _border_ tipis (`1px border-zinc-800`). Hindari _drop shadow_ tebal, gunakan _inner glow_ atau bayangan sangat halus hanya untuk _floating elements_ (seperti _dropdown_ atau _modal_).
- **Typography:** Gunakan font _Sans-serif_ modern (Geist atau Inter) dengan _tracking_ (jarak huruf) yang rapi. Font tidak terlalu besar.
- **Micro-interactions:** Animasi sangat cepat (150ms). Fokus pada efisiensi.
- **Keyboard-First:** Form dan navigasi utama harus mudah diakses dengan tombol `Tab`, `Enter`, dan _shortcuts_ (misal `Cmd+K` untuk tambah lamaran baru).

---

## 5. High-Level Database Schema (Supabase)

### Table: `profiles`

- `id` (uuid, PK, references `auth.users`)
- `full_name` (text)
- `avatar_url` (text)
- `updated_at` (timestamp)

### Table: `applications`

- `id` (uuid, PK)
- `user_id` (uuid, FK to `profiles.id`)
- `company_name` (text)
- `role` (text)
- `status` (enum: 'wishlist', 'applied', 'assessment', 'interview', 'offered', 'rejected')
- `job_type` (enum: 'remote', 'hybrid', 'onsite')
- `salary_range` (text, optional)
- `job_url` (text, optional)
- `description` (text, optional)
- `last_activity_date` (timestamp) - _Untuk perhitungan "Ghosting"_
- `created_at` (timestamp)

### Table: `notes`

- `id` (uuid, PK)
- `application_id` (uuid, FK to `applications.id`)
- `content` (text)
- `created_at` (timestamp)

---

## 6. Definition of Done (DoD)

1. Autentikasi via Supabase berhasil (Login/Logout aman).
2. Pengguna hanya dapat melihat dan mengedit lamaran kerjanya sendiri (RLS aktif).
3. Pengguna dapat membuat lamaran baru, mengedit, dan menghapusnya (CRUD berfungsi penuh).
4. Status lamaran dapat diubah melalui fitur _Drag-and-Drop_ di Kanban board dengan mulus (_Optimistic Update_ berjalan tanpa efek _flickering/loading_ panjang).
5. Sistem "Ghosting" berhasil mendeteksi dan memberikan indikator visual pada lamaran yang stagnan > 10 hari.
6. Desain 100% konsisten dengan panduan "Linear-style" (Gelap, minimalis, _snappy_).
