"use client";
import { useState } from 'react';

// ======================================================================
// GANTI DOMAIN LU DI SINI 
// Kalo besok ganti domain baru, cukup ubah tulisan di bawah ini aja.
// ======================================================================
const BASE_DOMAIN = 'copbhghuytr.eu.org';


export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); 
  const [generatedLink, setGeneratedLink] = useState('');
  const [copyText, setCopyText] = useState('Copy');

  const generateString = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({ type: 'info', message: 'Sedang memproses judul dan menyimpan...' });
    setGeneratedLink('');
    setCopyText('Copy');

    const stringAcak = generateString();
    const offer1Url = e.target.offer1Url.value;
    const offer2Url = e.target.offer2Url.value;
    let pathTambahan = 'viral-video'; 

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
        const finalLink = `https://${stringAcak}.${BASE_DOMAIN}`;
        setGeneratedLink(finalLink);
        setResult({
          type: 'success',
          message: `BERHASIL DISIMPAN!\nTarget Akhir: https://${BASE_DOMAIN}/${stringAcak}/${pathTambahan}`
        });
        e.target.reset();
      } else {
        setResult({ type: 'danger', message: 'Gagal menyimpan ke database. Cek koneksi Supabase.' });
      }
    } catch (error) {
      setResult({ type: 'danger', message: 'Gagal koneksi ke Vercel/Supabase.' });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  };

  return (
    <>
      {/* Load Bootstrap 3 & Google Icons langsung tanpa instalasi npm */}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Header Navbar */}
        <nav className="navbar navbar-default" style={{ borderRadius: 0, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <div className="container">
            <div className="navbar-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="navbar-brand" style={{ fontWeight: 'bold', color: '#333' }}>SmartLink Panel</span>
              <button className="btn btn-default btn-sm" style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '5px' }}>list_alt</span>
                List Link
              </button>
            </div>
          </div>
        </nav>

        {/* Konten Form */}
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <div className="row">
            <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
              
              {/* Box Form Bootstrap (Panel) */}
              <div className="panel panel-default" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderColor: '#e3e3e3' }}>
                <div className="panel-heading" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e3e3e3' }}>
                  <h3 className="panel-title" style={{ fontWeight: 'bold', fontSize: '16px' }}>Buat Link Baru</h3>
                </div>
                <div className="panel-body" style={{ padding: '20px' }}>
                  <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                      <label style={{ fontWeight: 'normal', color: '#555' }}>Offer 1 URL (Target Sosmed FB/IG)</label>
                      <input type="url" name="offer1Url" className="form-control" required placeholder="https://shopee.co.id/..." style={{ boxShadow: 'none', borderColor: '#ccc' }} />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label style={{ fontWeight: 'normal', color: '#555' }}>Offer 2 URL (Target Bot & Sumber Judul)</label>
                      <input type="url" name="offer2Url" className="form-control" required placeholder="https://youtube.com/..." style={{ boxShadow: 'none', borderColor: '#ccc' }} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ fontWeight: 'bold', padding: '10px' }}>
                      {loading ? 'Sedang Memproses...' : 'Generate String Acak & Simpan'}
                    </button>
                  </form>

                  {/* Area Notifikasi & Hasil (Tanpa JS Popup Alert) */}
                  {result && (
                    <div className={`alert alert-${result.type}`} style={{ marginTop: '20px', marginBottom: '0', padding: '15px' }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px' }}>{result.message}</p>
                      
                      {/* Muncul Form Copy Link kalau Sukses */}
                      {generatedLink && (
                        <div style={{ marginTop: '15px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Link Buat di Sosmed:</label>
                          <div className="input-group">
                            <input type="text" className="form-control" value={generatedLink} readOnly style={{ backgroundColor: '#fff', cursor: 'text' }} />
                            <span className="input-group-btn">
                              <button className="btn btn-success" type="button" onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', marginRight: '4px' }}>content_copy</span>
                                {copyText}
                              </button>
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
