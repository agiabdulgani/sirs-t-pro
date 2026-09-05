import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Hubungkan ke database lokal kamu (sesuaikan port & password-mu)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_sirst',
  password: 'password_lu',
  port: 5434, // Port database lokal
});

export async function GET() {
  try {
    // Query SQL untuk menghitung total pasien per hari dalam 7 hari terakhir
    const query = `
      SELECT 
        TO_CHAR(tanggal_daftar, 'DY') AS hari,
        COUNT(id)::int AS total
      FROM pasien
      WHERE tanggal_daftar >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE_TRUNC('day', tanggal_daftar), tanggal_daftar
      ORDER BY DATE_TRUNC('day', tanggal_daftar) ASC;
    `;
    
    const result = await pool.query(query);
    
    // Mapping singkatan hari agar serasi dengan UI (SEN, SEL, RAB, dst)
    const dayMapping = {
      'MON': 'SEN', 'TUE': 'SEL', 'WED': 'RAB', 
      'THU': 'KAM', 'FRI': 'JUM', 'SAT': 'SAB', 'SUN': 'MIN'
    };

    // Struktur awal default jika data di database masih kosong
    const defaultData = [
      { hari: 'SEN', pasien: 0 }, { hari: 'SEL', pasien: 0 }, { hari: 'RAB', pasien: 0 },
      { hari: 'KAM', pasien: 0 }, { hari: 'JUM', pasien: 0 }, { hari: 'SAB', pasien: 0 }, { hari: 'MIN', pasien: 0 }
    ];

    // Isi data default dengan hasil real-time dari database
    result.rows.forEach(row => {
      const formattedDay = dayMapping[row.hari.toUpperCase()];
      const match = defaultData.find(d => d.hari === formattedDay);
      if (match) {
        match.pasien = row.total;
      }
    });

    return NextResponse.json({ success: true, data: defaultData });
  } catch (error) {
    console.error('Gagal mengambil tren kunjungan:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}