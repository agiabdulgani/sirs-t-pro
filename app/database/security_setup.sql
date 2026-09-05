-- ==============================================================================
-- IMPLEMENTASI KEAMANAN DATA TERDISTRIBUSI (UAS BASIS DATA TERDISTRIBUSI)
-- Dosen Pengampu: Pak Nugraha
-- Disusun Oleh: Agi Abdul Gani - STT Cipasung
-- ==============================================================================

-- 1. Mengaktifkan izin penggunaan skema publik untuk user khusus FDW.
-- Ini adalah langkah awal untuk memastikan koneksi antar-node berjalan dengan tertib.
GRANT USAGE ON SCHEMA public TO fdw_user;

-- 2. Memberikan akses READ-ONLY (SELECT) secara spesifik pada tabel pasien.
-- Hal ini diterapkan untuk menjamin privasi data pasien lintas cabang tetap terjaga,
-- sekaligus mencegah adanya perubahan data yang tidak sah dari node eksternal.
GRANT SELECT ON TABLE pasien TO fdw_user;

-- 3. Memberikan akses akses baca (SELECT) pada tabel rekam_medis.
-- Dengan hak akses terbatas ini, dokter di cabang lain tetap bisa memberikan 
-- pelayanan yang konsisten (continuity of care) tanpa mengorbankan keamanan database utama.
GRANT SELECT ON TABLE rekam_medis TO fdw_user;

-- ==============================================================================
-- CATATAN KEAMANAN (LEAST PRIVILEGE PRINCIPLE):
-- Sistem ini secara sengaja tidak memberikan izin INSERT, UPDATE, atau DELETE
-- kepada fdw_user guna menerapkan "Limited User Mapping". Strategi ini diambil
-- untuk memastikan bahwa integritas data rumah sakit tetap 100% aman meskipun
-- diakses melalui jaringan database terdistribusi.
-- ==============================================================================