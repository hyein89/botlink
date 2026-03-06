"use client";
import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Fungsi pembuat string acak (6 karakter)
  const generateString = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stringAcak = generateString();
    const pathTambahan = e.target.pathTambahan.value.replace(/\s+/g, '-').toLowerCase(); // Otomatis rapihin spasi jadi strip
    const offer1Url = e.target.offer1Url.value;
    const offer2Url = e.target.offer2Url.value;

    // Mengambil kunci rahasia dari Vercel
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
      // Mengirim data ke Supabase
      const res = await fetch(`${supabaseUrl}/rest/v1/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          string_acak: stringAcak,
          path_tambahan: pathTambahan,
          offer1_url: offer1Url,
          offer2_url: offer2Url,
          hit_count: 0
          // created_at akan otomatis diisi oleh Supabase
        })
      });

      if (res.ok) {
        setResult(`Sukses! Link kamu: https://${stringAcak}.sekonlive.eu.org`);
        e.target.reset();
      } else {
        setResult('Gagal menyimpan ke database. Cek koneksi Vercel-Supabase.');
      }
    } catch (error) {
      setResult('Terjadi kesalahan jaringan.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2>Buat Smart Link Baru</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Path Tambahan / Judul Offer 2 (Contoh: title-offer2):</label><br/>
          <input type="text" name="pathTambahan" required style={{ width: '100%', padding: '8px' }} placeholder="title-offer2" />
        </div>

        <div>
          <label>Offer 1 URL (Target Sosmed - Manusia):</label><br/>
          <input type="url" name="offer1Url" required style={{ width: '100%', padding: '8px' }} placeholder="https://landingpage-sosmed.com" />
        </div>

        <div>
          <label>Offer 2 URL (Target Pancingan Bot & Browser Langsung):</label><br/>
          <input type="url" name="offer2Url" required style={{ width: '100%', padding: '8px' }} placeholder="https://youtube.com/videoviral" />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Memproses...' : 'Generate String Acak & Simpan'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa', color: '#006064', fontWeight: 'bold' }}>
          {result}
        </div>
      )}
    </div>
  );
}
