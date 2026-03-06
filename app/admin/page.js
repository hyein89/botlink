"use client";
import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generateString = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Sedang memproses...');

    const stringAcak = generateString();
    const offer1Url = e.target.offer1Url.value;
    const offer2Url = e.target.offer2Url.value;
    let pathTambahan = 'viral-video'; // Judul default kalau nge-bug

    // 1. Usaha narik judul (Gagal gak apa-apa, gak bakal crash)
    try {
      const titleRes = await fetch('/api/get-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: offer2Url })
      });
      if (titleRes.ok) {
        const titleData = await titleRes.json();
        if (titleData.title) pathTambahan = titleData.title;
      }
    } catch (err) {
      console.log('Gagal narik judul, pakai default.');
    }

    // 2. Simpan ke Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
        })
      });

      if (res.ok) {
        setResult(`BERHASIL!\n\nLink Lo: https://${stringAcak}.sekonlive.eu.org\nNtar berubah jadi: https://sekonlive.eu.org/${stringAcak}/${pathTambahan}`);
        e.target.reset();
      } else {
        setResult('Gagal nyimpen ke database. RLS Supabase belum dimatikan atau koneksi salah.');
      }
    } catch (error) {
      setResult('Gagal koneksi ke Vercel/Supabase.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Buat Link Baru</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="url" name="offer1Url" required placeholder="Offer 1 URL (Target Sosmed)" style={{ padding: '10px' }} />
        <input type="url" name="offer2Url" required placeholder="Offer 2 URL (Target Pancingan Bot)" style={{ padding: '10px' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px', background: 'blue', color: 'white' }}>
          {loading ? 'Memproses...' : 'Generate & Simpan'}
        </button>
      </form>
      {result && <pre style={{ marginTop: '20px', background: '#eee', padding: '10px', whiteSpace: 'pre-wrap' }}>{result}</pre>}
    </div>
  );
}
