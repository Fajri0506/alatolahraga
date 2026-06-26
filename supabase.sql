-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    role VARCHAR(20) DEFAULT 'penyewa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel kategori_alat
CREATE TABLE IF NOT EXISTS kategori_alat (
    id_kategori SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel alat_olahraga
CREATE TABLE IF NOT EXISTS alat_olahraga (
    id_alat SERIAL PRIMARY KEY,
    id_kategori INT,
    nama_alat VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    stok INT DEFAULT 0,
    harga_sewa DECIMAL(10,2) NOT NULL,
    kondisi VARCHAR(20) DEFAULT 'baik',
    foto VARCHAR(255),
    status VARCHAR(20) DEFAULT 'tersedia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori_alat(id_kategori)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 4. Tabel penyewaan
CREATE TABLE IF NOT EXISTS penyewaan (
    id_penyewaan SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    tanggal_sewa DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    total_harga DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'menunggu',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 5. Tabel detail_penyewaan
CREATE TABLE IF NOT EXISTS detail_penyewaan (
    id_detail SERIAL PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    id_alat INT NOT NULL,
    jumlah INT NOT NULL,
    harga_sewa DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_alat) REFERENCES alat_olahraga(id_alat)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 6. Tabel pengembalian
CREATE TABLE IF NOT EXISTS pengembalian (
    id_pengembalian SERIAL PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    tanggal_dikembalikan DATE NOT NULL,
    kondisi_kembali VARCHAR(20) DEFAULT 'baik',
    denda DECIMAL(10,2) DEFAULT 0,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 7. Tabel pembayaran
CREATE TABLE IF NOT EXISTS pembayaran (
    id_pembayaran SERIAL PRIMARY KEY,
    id_penyewaan INT NOT NULL,
    metode_pembayaran VARCHAR(50),
    jumlah_bayar DECIMAL(10,2) NOT NULL,
    status_pembayaran VARCHAR(50) DEFAULT 'belum_bayar',
    tanggal_bayar DATE,
    bukti_pembayaran VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_penyewaan) REFERENCES penyewaan(id_penyewaan)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Seeder Kategori Alat Olahraga
INSERT INTO kategori_alat (nama_kategori, deskripsi) VALUES
('Futsal', 'Peralatan dan perlengkapan untuk olahraga futsal seperti bola, rompi, dll.'),
('Badminton', 'Peralatan badminton seperti raket, shuttlecock, net, dll.'),
('Basket', 'Peralatan basket seperti bola basket, pompa, dll.'),
('Voli', 'Peralatan voli seperti bola voli, net voli, dll.'),
('Fitness', 'Alat-alat fitness/gym portable seperti dumbbell, matras yoga, dll.');
