"use client";
import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generateString = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Sedang menarik judul otomatis dari Offer 2...');

    const stringAcak = generateString();
    const offer1Url = e.target.offer1Url.value;
    const offer2Url = e.target.offer2Url.value;

    try {
      // 1. Eksekusi Tarik Judul
      const titleRes = await fetch('/api/get-title', {
        method: 'POST',
        body: JSON.stringify({ url: offer2Url })
      });
      const titleData = await titleRes.json();
      const pathTambahan = titleData.title || 'promo-link';

      setResult('Menyimpan ke database...');

      // 2. Simpan ke Supabase
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
        setResult(`BERHASIL!\n\nLink lu: https://${stringAcak}.sekonlive.eu.org\nNtar otomatis berubah jadi: https://sekonlive.eu.org/${pathTambahan}`);
        e.target.reset();
      } else {
        setResult('Gagal nyimpen! Pastiin lo udah matiin RLS di Supabase pakai SQL.');
      }
    } catch (error) {
      setResult('Terjadi kesalahan sistem atau jaringan.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2>Buat Smart Link Baru</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Offer 1 URL (Target Sosmed - Manusia):</label><br/>
          <input type="url" name="offer1Url" required style={{ width: '100%', padding: '8px' }} placeholder="https://google.com" />
        </div>

        <div>
          <label>Offer 2 URL (Target Pancingan Bot & Sumber Judul):</label><br/>
          <input type="url" name="offer2Url" required style={{ width: '100%', padding: '8px' }} placeholder="https://youtu.be/..." />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Memproses Judul & Nyimpen...' : 'Generate Auto-Title & Simpan'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa', color: '#006064', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
          {result}
        </div>
      )}
    </div>
  );
}
