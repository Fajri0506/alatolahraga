# Plan Implementasi Fullstack  
# Sistem Penyewaan Alat Olahraga

## 1. Gambaran Umum Sistem

Sistem **Penyewaan Alat Olahraga** adalah aplikasi berbasis website yang digunakan untuk mengelola proses penyewaan alat olahraga secara digital. Sistem ini melibatkan dua jenis pengguna utama, yaitu **admin** dan **penyewa**.

Admin bertugas mengelola data alat olahraga, kategori alat, transaksi penyewaan, pengembalian, pembayaran, dan laporan. Penyewa dapat melihat daftar alat olahraga yang tersedia, mengajukan penyewaan, melihat status penyewaan, melakukan pembayaran, dan melihat riwayat transaksi.

---

## 2. Tech Stack yang Digunakan

### 2.1 Database

Database yang digunakan adalah **MySQL**.

Fungsi database:

- Menyimpan data pengguna.
- Menyimpan data kategori alat olahraga.
- Menyimpan data alat olahraga.
- Menyimpan data transaksi penyewaan.
- Menyimpan data pengembalian.
- Menyimpan data pembayaran.

### 2.2 Backend

Backend menggunakan:

- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Bcrypt
- CORS
- Dotenv
- Multer
- Struktur MVC

Fungsi backend:

- Menghubungkan frontend dengan database.
- Membuat REST API.
- Mengatur autentikasi login dan register.
- Mengelola validasi data.
- Mengatur role admin dan penyewa.
- Mengelola proses penyewaan, pengembalian, dan pembayaran.

### 2.3 Frontend

Frontend menggunakan:

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

Fungsi frontend:

- Menampilkan halaman aplikasi.
- Menampilkan daftar alat olahraga.
- Menyediakan form login dan register.
- Menyediakan dashboard admin.
- Menyediakan halaman penyewaan untuk pengguna.
- Menampilkan status penyewaan dan pembayaran.

---

## 3. Struktur Database

Database yang digunakan:

```sql
CREATE DATABASE db_penyewaan_alat_olahraga;
USE db_penyewaan_alat_olahraga;
```

---

## 4. Tabel Database

### 4.1 Tabel `users`

Tabel ini digunakan untuk menyimpan data pengguna, baik admin maupun penyewa.

```sql
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    role ENUM('admin', 'penyewa') DEFAULT 'penyewa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Fungsi tabel:

- Menyimpan akun pengguna.
- Membedakan role admin dan penyewa.
- Digunakan untuk proses login dan register.

---

### 4.2 Tabel `kategori_alat`

Tabel ini digunakan untuk menyimpan kategori alat olahraga.

```sql
CREATE TABLE kategori_alat (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Contoh kategori:

- Futsal
- Badminton
- Basket
- Voli
- Fitness
- Tenis Meja

---

### 4.3 Tabel `alat_olahraga`

Tabel ini digunakan untuk menyimpan data alat olahraga yang dapat disewa.

```sql
CREATE TABLE alat_olahraga (
    id_alat INT AUTO_INCREMENT PRIMARY KEY,
    id_kategori INT,
    nama_alat VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    stok INT DEFAULT 0,
    harga_sewa DECIMAL(10,2) NOT NULL,
    kondisi ENUM('baik', 'rusak', 'hilang') DEFAULT 'baik',
    foto VARCHAR(255),
    status ENUM('tersedia', 'tidak_tersedia', 'rusak') DEFAULT 'tersedia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori_alat(id_kategori)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
```

Fungsi tabel:

- Menyimpan nama alat olahraga.
- Menyimpan stok alat.
- Menyimpan harga sewa.
- Menyimpan kondisi alat.
- Menyimpan status ketersediaan alat.

---

### 4.4 Tabel `penyewaan`

Tabel ini digunakan untuk menyimpan transaksi utama penyewaan.

```sql
CREATE TABLE penyewaan (
    id_penyewaan INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    tanggal_sewa DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    total_harga DECIMAL(10,2) DEFAULT 0,
    status ENUM(
        'menunggu',
        'disetujui',
        'ditolak',
        'sedang_disewa',
        'selesai',
        'terlambat',
        'dibatalkan'
    ) DEFAULT 'menunggu',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

Fungsi tabel:

- Menyimpan data penyewaan.
- Menyimpan tanggal sewa.
- Menyimpan tanggal pengembalian.
- Menyimpan total harga.
- Menyimpan status penyewaan.

---

### 4.5 Tabel `detail_penyewaan`

Tabel ini digunakan untuk menyimpan detail alat yang disewa dalam satu transaksi.

```sql
CREATE TABLE detail_penyewaan (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    id_alat INT NOT NULL,
    jumlah INT NOT NULL,
    harga_sewa DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_alat) REFERENCES alat_olahraga(id_alat)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

Fungsi tabel:

- Menyimpan alat yang disewa.
- Menyimpan jumlah alat yang disewa.
- Menyimpan subtotal harga.
- Menghubungkan tabel penyewaan dengan alat olahraga.

---

### 4.6 Tabel `pengembalian`

Tabel ini digunakan untuk mencatat proses pengembalian alat olahraga.

```sql
CREATE TABLE pengembalian (
    id_pengembalian INT AUTO_INCREMENT PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    tanggal_dikembalikan DATE NOT NULL,
    kondisi_kembali ENUM('baik', 'rusak', 'hilang') DEFAULT 'baik',
    denda DECIMAL(10,2) DEFAULT 0,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

Fungsi tabel:

- Menyimpan tanggal alat dikembalikan.
- Menyimpan kondisi alat saat dikembalikan.
- Menyimpan denda jika terlambat, rusak, atau hilang.
- Menyimpan catatan pengembalian.

---

### 4.7 Tabel `pembayaran`

Tabel ini digunakan untuk menyimpan data pembayaran penyewaan.

```sql
CREATE TABLE pembayaran (
    id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    metode_pembayaran VARCHAR(50),
    jumlah_bayar DECIMAL(10,2) NOT NULL,
    status_pembayaran ENUM(
        'belum_bayar',
        'menunggu_verifikasi',
        'lunas',
        'ditolak'
    ) DEFAULT 'belum_bayar',
    tanggal_bayar DATE,
    bukti_pembayaran VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

Fungsi tabel:

- Menyimpan data pembayaran.
- Menyimpan metode pembayaran.
- Menyimpan bukti pembayaran.
- Menyimpan status pembayaran.

---

## 5. Relasi Antar Tabel

Relasi database dalam sistem ini adalah sebagai berikut:

```text
users 1 - banyak penyewaan
kategori_alat 1 - banyak alat_olahraga
penyewaan 1 - banyak detail_penyewaan
alat_olahraga 1 - banyak detail_penyewaan
penyewaan 1 - 1 pengembalian
penyewaan 1 - 1 pembayaran
```

Penjelasan:

- Satu pengguna dapat melakukan banyak penyewaan.
- Satu kategori dapat memiliki banyak alat olahraga.
- Satu penyewaan dapat memiliki banyak detail alat.
- Satu alat dapat muncul di banyak detail penyewaan.
- Satu penyewaan memiliki satu data pengembalian.
- Satu penyewaan memiliki satu data pembayaran.

---

## 6. Struktur Folder Backend

```bash
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── kategoriController.js
│   │   ├── alatController.js
│   │   ├── penyewaanController.js
│   │   ├── pengembalianController.js
│   │   └── pembayaranController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── kategoriModel.js
│   │   ├── alatModel.js
│   │   ├── penyewaanModel.js
│   │   ├── pengembalianModel.js
│   │   └── pembayaranModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── kategoriRoutes.js
│   │   ├── alatRoutes.js
│   │   ├── penyewaanRoutes.js
│   │   ├── pengembalianRoutes.js
│   │   └── pembayaranRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── uploads/
│   └── app.js
├── .env
├── package.json
└── server.js
```

---

## 7. Struktur Folder Frontend

```bash
frontend/
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── CardAlat.jsx
│   │   ├── TableData.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── UserLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── AlatList.jsx
│   │   ├── DetailAlat.jsx
│   │   ├── SewaAlat.jsx
│   │   ├── RiwayatSewa.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminAlat.jsx
│   │   ├── AdminKategori.jsx
│   │   ├── AdminPenyewaan.jsx
│   │   ├── AdminPengembalian.jsx
│   │   └── AdminPembayaran.jsx
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## 8. Plan Implementasi Paralel

Implementasi dilakukan secara paralel antara database, backend, dan frontend agar proses pengerjaan lebih cepat dan terstruktur.

---

## 9. Tahap 1 — Persiapan Project

### Database

Tugas:

- Membuat rancangan ERD.
- Membuat database.
- Membuat tabel utama.
- Menentukan relasi antar tabel.
- Menyiapkan data awal atau seeder.

Output:

- Database berhasil dibuat.
- Struktur tabel sudah siap.
- Relasi antar tabel sudah jelas.

### Backend

Tugas:

- Membuat project Express.js.
- Menginstall package backend.
- Membuat struktur folder MVC.
- Membuat koneksi ke MySQL.
- Membuat file `.env`.

Package yang digunakan:

```bash
npm init -y
npm install express mysql2 cors dotenv bcrypt jsonwebtoken multer
npm install nodemon --save-dev
```

Output:

- Server Express berhasil berjalan.
- Backend berhasil terhubung ke database.
- Struktur folder backend siap digunakan.

### Frontend

Tugas:

- Membuat project React dengan Vite.
- Menginstall Tailwind CSS.
- Menginstall Axios.
- Menginstall React Router DOM.
- Membuat struktur folder frontend.

Perintah instalasi:

```bash
npm create vite@latest frontend
cd frontend
npm install
npm install axios react-router-dom
npm install tailwindcss @tailwindcss/vite
```

Output:

- React berhasil dijalankan.
- Tailwind CSS siap digunakan.
- Routing dasar sudah dibuat.

---

## 10. Tahap 2 — Implementasi Autentikasi

### Database

Tabel yang digunakan:

```text
users
```

Data yang disimpan:

- Nama
- Email
- Password
- Nomor HP
- Alamat
- Role

### Backend

Fitur yang dibuat:

- Register
- Login
- Get profile
- Middleware autentikasi
- Middleware admin

Endpoint:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

Alur backend:

1. User melakukan register.
2. Password di-hash menggunakan bcrypt.
3. Data user disimpan ke database.
4. User melakukan login.
5. Backend mengecek email dan password.
6. Jika benar, backend membuat token JWT.
7. Token dikirim ke frontend.
8. Token digunakan untuk mengakses halaman yang dilindungi.

### Frontend

Halaman yang dibuat:

- Login
- Register
- Profile
- ProtectedRoute
- AuthContext

Alur frontend:

1. User mengisi form login atau register.
2. Data dikirim ke backend menggunakan Axios.
3. Jika login berhasil, token disimpan ke localStorage.
4. User diarahkan ke halaman utama.
5. Jika role admin, user diarahkan ke dashboard admin.
6. Jika role penyewa, user diarahkan ke halaman penyewa.

---

## 11. Tahap 3 — Implementasi Master Data Alat

### Database

Tabel yang digunakan:

```text
kategori_alat
alat_olahraga
```

Relasi:

```text
kategori_alat 1 - banyak alat_olahraga
```

### Backend

Endpoint kategori:

```http
GET /api/kategori
POST /api/kategori
PUT /api/kategori/:id
DELETE /api/kategori/:id
```

Endpoint alat olahraga:

```http
GET /api/alat
GET /api/alat/:id
POST /api/alat
PUT /api/alat/:id
DELETE /api/alat/:id
```

Fitur backend:

- CRUD kategori.
- CRUD alat olahraga.
- Upload foto alat.
- Filter alat berdasarkan kategori.
- Search alat berdasarkan nama.
- Validasi stok alat.

### Frontend

Halaman user:

- Daftar alat olahraga.
- Detail alat olahraga.
- Filter kategori.
- Search alat.

Halaman admin:

- Kelola kategori.
- Tambah kategori.
- Edit kategori.
- Hapus kategori.
- Kelola alat.
- Tambah alat.
- Edit alat.
- Hapus alat.

---

## 12. Tahap 4 — Implementasi Penyewaan

### Database

Tabel yang digunakan:

```text
penyewaan
detail_penyewaan
alat_olahraga
```

### Backend

Endpoint penyewaan:

```http
POST /api/penyewaan
GET /api/penyewaan
GET /api/penyewaan/user
GET /api/penyewaan/:id
PUT /api/penyewaan/:id/status
DELETE /api/penyewaan/:id
```

Logika backend:

1. User memilih alat olahraga.
2. Backend mengecek stok alat.
3. Backend menghitung lama sewa.
4. Backend menghitung total harga.
5. Data masuk ke tabel `penyewaan`.
6. Detail alat masuk ke tabel `detail_penyewaan`.
7. Status awal penyewaan adalah `menunggu`.
8. Admin dapat menyetujui atau menolak penyewaan.
9. Jika disetujui, stok alat berkurang.
10. Jika ditolak, stok tidak berubah.

### Frontend

Halaman user:

- Form sewa alat.
- Keranjang sewa.
- Riwayat penyewaan.
- Detail penyewaan.
- Status penyewaan.

Halaman admin:

- Daftar permintaan sewa.
- Detail permintaan.
- Tombol setujui penyewaan.
- Tombol tolak penyewaan.
- Ubah status menjadi sedang disewa.

---

## 13. Tahap 5 — Implementasi Pengembalian

### Database

Tabel yang digunakan:

```text
pengembalian
penyewaan
alat_olahraga
```

### Backend

Endpoint pengembalian:

```http
POST /api/pengembalian
GET /api/pengembalian
GET /api/pengembalian/:id
PUT /api/pengembalian/:id
DELETE /api/pengembalian/:id
```

Logika backend:

1. Admin membuka data penyewaan aktif.
2. Admin mencatat tanggal pengembalian.
3. Sistem mengecek apakah pengembalian terlambat.
4. Jika terlambat, sistem menghitung denda.
5. Admin mencatat kondisi alat.
6. Jika alat baik, stok dikembalikan.
7. Jika alat rusak atau hilang, stok tidak langsung dikembalikan.
8. Status penyewaan berubah menjadi `selesai`.

### Frontend

Halaman admin:

- Daftar penyewaan aktif.
- Form pengembalian.
- Data pengembalian.
- Status kondisi alat.
- Perhitungan denda.

Halaman user:

- Status pengembalian.
- Detail denda.
- Riwayat sewa selesai.

---

## 14. Tahap 6 — Implementasi Pembayaran

### Database

Tabel yang digunakan:

```text
pembayaran
penyewaan
pengembalian
```

### Backend

Endpoint pembayaran:

```http
POST /api/pembayaran
GET /api/pembayaran
GET /api/pembayaran/user
GET /api/pembayaran/:id
PUT /api/pembayaran/:id/status
DELETE /api/pembayaran/:id
```

Logika backend:

1. Sistem membuat tagihan dari total sewa.
2. Jika terlambat, sistem menambahkan denda.
3. User mengupload bukti pembayaran.
4. Admin memverifikasi pembayaran.
5. Jika bukti benar, status pembayaran menjadi `lunas`.
6. Jika bukti salah, status pembayaran menjadi `ditolak`.

### Frontend

Halaman user:

- Tagihan saya.
- Upload bukti pembayaran.
- Status pembayaran.

Halaman admin:

- Data pembayaran.
- Verifikasi pembayaran.
- Tolak pembayaran.
- Laporan pembayaran.

---

## 15. Tahap 7 — Dashboard dan Laporan

### Backend

Endpoint dashboard:

```http
GET /api/dashboard/summary
```

Data yang ditampilkan:

- Total alat.
- Total user.
- Total penyewaan.
- Total penyewaan menunggu.
- Total alat sedang disewa.
- Total pembayaran lunas.
- Total pendapatan.
- Total denda.

### Frontend

Dashboard admin menampilkan:

- Card total data.
- Grafik penyewaan.
- Tabel penyewaan terbaru.
- Tabel pembayaran terbaru.
- Status alat tersedia, rusak, atau sedang disewa.

Dashboard user menampilkan:

- Total penyewaan saya.
- Penyewaan aktif.
- Status pembayaran.
- Riwayat terakhir.

---

## 16. Alur Sistem dari Awal sampai Akhir

```text
User registrasi
        ↓
User login
        ↓
User melihat daftar alat olahraga
        ↓
User memilih alat
        ↓
User mengisi tanggal sewa dan tanggal kembali
        ↓
Sistem menghitung total harga
        ↓
User mengajukan penyewaan
        ↓
Admin menerima permintaan
        ↓
Admin menyetujui atau menolak
        ↓
Jika disetujui, status menjadi sedang disewa
        ↓
User mengembalikan alat
        ↓
Admin mencatat pengembalian
        ↓
Sistem mengecek keterlambatan
        ↓
Sistem menghitung denda jika ada
        ↓
User melakukan pembayaran
        ↓
Admin verifikasi pembayaran
        ↓
Status penyewaan selesai
```

---

## 17. Timeline Pengerjaan

### Minggu 1 — Setup dan Database

| Hari | Database | Backend | Frontend |
|---|---|---|---|
| Hari 1 | Buat ERD | Setup Express | Setup React |
| Hari 2 | Buat tabel users | Koneksi MySQL | Setup Tailwind |
| Hari 3 | Buat tabel kategori dan alat | Struktur MVC | Setup routing |
| Hari 4 | Buat tabel penyewaan | Middleware auth | Layout login |
| Hari 5 | Buat tabel detail penyewaan | Testing koneksi API | Layout dashboard |

Output minggu 1:

- Database siap.
- Backend siap jalan.
- Frontend siap jalan.

---

### Minggu 2 — Auth dan Master Data

| Hari | Database | Backend | Frontend |
|---|---|---|---|
| Hari 1 | Seeder admin | Register API | Register page |
| Hari 2 | Seeder user | Login API | Login page |
| Hari 3 | Seeder kategori | CRUD kategori | Admin kategori |
| Hari 4 | Seeder alat | CRUD alat | Admin alat |
| Hari 5 | Relasi alat-kategori | Upload foto alat | Daftar alat user |

Output minggu 2:

- Login dan register berjalan.
- Admin bisa mengelola alat.
- User bisa melihat alat.

---

### Minggu 3 — Penyewaan

| Hari | Database | Backend | Frontend |
|---|---|---|---|
| Hari 1 | Cek relasi penyewaan | Create penyewaan | Form sewa |
| Hari 2 | Detail penyewaan | Hitung total harga | Keranjang sewa |
| Hari 3 | Status penyewaan | Approve atau reject sewa | Admin penyewaan |
| Hari 4 | Update stok | Riwayat user | Riwayat sewa |
| Hari 5 | Testing transaksi | Validasi stok | Detail status sewa |

Output minggu 3:

- User bisa menyewa alat.
- Admin bisa menyetujui atau menolak penyewaan.
- Stok alat berubah otomatis.

---

### Minggu 4 — Pengembalian dan Pembayaran

| Hari | Database | Backend | Frontend |
|---|---|---|---|
| Hari 1 | Tabel pengembalian | API pengembalian | Form pengembalian |
| Hari 2 | Tabel pembayaran | API pembayaran | Halaman pembayaran |
| Hari 3 | Denda terlambat | Hitung denda otomatis | Detail tagihan |
| Hari 4 | Status lunas | Verifikasi pembayaran | Admin pembayaran |
| Hari 5 | Testing transaksi akhir | Error handling | Rapikan UI |

Output minggu 4:

- Pengembalian berjalan.
- Denda otomatis.
- Pembayaran bisa diverifikasi admin.

---

### Minggu 5 — Dashboard, Testing, dan Deploy

| Hari | Database | Backend | Frontend |
|---|---|---|---|
| Hari 1 | Optimasi query | API dashboard | Dashboard admin |
| Hari 2 | Backup database | Testing semua API | Dashboard user |
| Hari 3 | Cek data error | Error handling global | Responsive mobile |
| Hari 4 | Finalisasi seeder | Dokumentasi API | Dokumentasi penggunaan |
| Hari 5 | Siap deploy | Deploy backend | Deploy frontend |

Output minggu 5:

- Aplikasi siap dipresentasikan.
- Aplikasi siap dikumpulkan.
- Aplikasi siap dikembangkan lebih lanjut.

---

## 18. Fitur Minimum yang Wajib Ada

### 18.1 Fitur User

- Register.
- Login.
- Lihat alat olahraga.
- Detail alat olahraga.
- Ajukan penyewaan.
- Lihat riwayat penyewaan.
- Lihat status pembayaran.

### 18.2 Fitur Admin

- Login admin.
- Dashboard admin.
- Kelola kategori.
- Kelola alat olahraga.
- Kelola penyewaan.
- Setujui atau tolak penyewaan.
- Catat pengembalian.
- Kelola pembayaran.

---

## 19. Fitur Tambahan Jika Masih Ada Waktu

- Search alat olahraga.
- Filter kategori.
- Upload foto alat.
- Upload bukti pembayaran.
- Cetak laporan PDF.
- Export laporan Excel.
- Notifikasi status sewa.
- Rating alat olahraga.
- Riwayat alat rusak atau hilang.

---

## 20. Prioritas Pengerjaan

### 20.1 Prioritas 1 — Wajib

- Database.
- Login dan register.
- CRUD alat olahraga.
- CRUD penyewaan.
- CRUD pengembalian.
- CRUD pembayaran.
- Dashboard admin.

### 20.2 Prioritas 2 — Penting

- Upload foto alat.
- Upload bukti pembayaran.
- Filter dan search alat.
- Riwayat penyewaan user.
- Hitung denda otomatis.

### 20.3 Prioritas 3 — Tambahan

- Export laporan.
- Cetak invoice.
- Notifikasi.
- Rating alat.
- Grafik dashboard.

---

## 21. Checklist Implementasi

### Database

- [ ] Membuat database.
- [ ] Membuat tabel users.
- [ ] Membuat tabel kategori_alat.
- [ ] Membuat tabel alat_olahraga.
- [ ] Membuat tabel penyewaan.
- [ ] Membuat tabel detail_penyewaan.
- [ ] Membuat tabel pengembalian.
- [ ] Membuat tabel pembayaran.
- [ ] Membuat relasi antar tabel.
- [ ] Membuat data awal atau seeder.

### Backend

- [ ] Setup Express.js.
- [ ] Koneksi MySQL.
- [ ] Membuat struktur MVC.
- [ ] Membuat auth register.
- [ ] Membuat auth login.
- [ ] Membuat middleware JWT.
- [ ] Membuat middleware admin.
- [ ] Membuat CRUD kategori.
- [ ] Membuat CRUD alat olahraga.
- [ ] Membuat CRUD penyewaan.
- [ ] Membuat CRUD pengembalian.
- [ ] Membuat CRUD pembayaran.
- [ ] Membuat endpoint dashboard.
- [ ] Testing API menggunakan Postman atau Thunder Client.

### Frontend

- [ ] Setup React Vite.
- [ ] Setup Tailwind CSS.
- [ ] Setup React Router DOM.
- [ ] Setup Axios.
- [ ] Membuat halaman login.
- [ ] Membuat halaman register.
- [ ] Membuat layout user.
- [ ] Membuat layout admin.
- [ ] Membuat dashboard admin.
- [ ] Membuat halaman daftar alat.
- [ ] Membuat halaman detail alat.
- [ ] Membuat halaman sewa alat.
- [ ] Membuat halaman riwayat penyewaan.
- [ ] Membuat halaman pembayaran.
- [ ] Membuat halaman pengembalian admin.
- [ ] Membuat halaman responsive mobile.

---

## 22. Kesimpulan

Implementasi sistem **Penyewaan Alat Olahraga** dilakukan dengan pendekatan fullstack menggunakan **MySQL sebagai database**, **Node.js Express sebagai backend**, dan **React.js sebagai frontend**.

Pengerjaan dilakukan secara paralel agar setiap bagian dapat dikembangkan dengan terstruktur. Database menjadi dasar penyimpanan data, backend menjadi penghubung sekaligus pengolah logika sistem, sedangkan frontend menjadi tampilan yang digunakan oleh admin dan penyewa.

Dengan plan ini, sistem dapat dikembangkan mulai dari fitur dasar seperti login, CRUD alat olahraga, penyewaan, pengembalian, pembayaran, hingga fitur tambahan seperti laporan, upload bukti pembayaran, dan dashboard statistik.
