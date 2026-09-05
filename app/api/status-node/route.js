import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Hubungkan ke Database Utama (Node Cipasung)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aji_admin:password_aji@db_sirst:5432/labdb',
});

export async function GET() {
  let primaryStatus = 'Disconnected';
  let secondaryStatus = 'Disconnected';
  let latency = '0ms';

  const startTime = Date.now();

  try {
  
    const primaryClient = await pool.connect();
    primaryStatus = 'Connected';
    primaryClient.release();

  
    const fdwCheck = await pool.query(`
      SELECT 1 FROM pg_foreign_server WHERE srvname = 'secondary_server';
    `);

    if (fdwCheck.rows.length > 0) {
      await pool.query('SELECT 1 FROM rekam_medis LIMIT 1;');
      secondaryStatus = 'Connected (via FDW)';
    }

    latency = `${Date.now() - startTime}ms`;

  } catch (error) {
    console.error('Gagal memeriksa status node:', error);
    // Jika database utama aman tapi database sekunder refused, status utama tetap Connected
  }

  return NextResponse.json({
    nodes: [
      {
        name: 'Node Utama (Cipasung - Primary)',
        status: primaryStatus,
        ip_host: 'db_sirst',
        port: '5434'
      },
      {
        name: 'Node Sekunder (Singaparna - Secondary)',
        status: secondaryStatus,
        ip_host: 'db_sirst_secondary',
        port: '5435'
      }
    ],
    latency,
    lastChecked: new Date().toLocaleTimeString('id-ID')
  });
}