"use client";
import { useState } from 'react';
// Narik file config.js dari folder luar (root)
import { appConfig } from '../../config.js'; 
import Link from 'next/link'; // Taruh di baris atas sendiri
export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); 
  const [generatedLink, setGeneratedLink] = useState('');
  const [copyText, setCopyText] = useState('Copy Link');

  const generateString = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({ type: 'info', message: 'Sedang memproses judul & menyimpan...' });
    setGeneratedLink('');
    setCopyText('Copy Link');

    const stringAcak = generateString();
    const offer2Url = e.target.offer2Url.value;
    
    // NGAIT DATA DARI FILE CONFIG LUAR
    const offer1Url = appConfig.OFFER1;        
    const domainAktif = appConfig.DOMAIN;
    let pathTambahan = 'viral-video'; 

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
        const finalLink = `https://${stringAcak}.${domainAktif}`;
        setGeneratedLink(finalLink);
        setResult({
          type: 'success',
          message: `Mantap! Berhasil Disimpan.`
        });
        e.target.reset();
      } else {
        setResult({ type: 'danger', message: 'Gagal! Cek koneksi Supabase lo.' });
      }
    } catch (error) {
      setResult({ type: 'danger', message: 'Gagal koneksi ke server.' });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopyText('Tercopy!');
      setTimeout(() => setCopyText('Copy Link'), 2000);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{__html: `
        body { font-family: 'Poppins', sans-serif; background-color: #f4f7f6; color: #2b2d42; }
        .admin-wrapper { min-height: 100vh; padding-top: 40px; padding-bottom: 40px; }
        .modern-card { background: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.04); padding: 30px; border: none; }
        .brand-title { font-weight: 700; font-size: 24px; color: #2b2d42; display: flex; align-items: center; gap: 8px; margin-top: 0; }
        .brand-subtitle { font-size: 13px; color: #8d99ae; margin-bottom: 25px; }
        .input-custom { border-radius: 10px; padding: 22px 15px; border: 2px solid #edf2f4; box-shadow: none; font-size: 14px; background: #fdfdfd; transition: all 0.3s; }
        .input-custom:focus { border-color: #3a86ff; background: #fff; box-shadow: 0 0 0 4px rgba(58, 134, 255, 0.1); }
        .btn-custom { background: #3a86ff; color: #fff; border-radius: 10px; font-weight: 600; padding: 12px; font-size: 15px; border: none; transition: all 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px;}
        .btn-custom:hover { background: #2563eb; color: #fff; box-shadow: 0 4px 15px rgba(58, 134, 255, 0.3); }
        .result-box { background: #f8f9fa; border-radius: 12px; padding: 20px; border: 1px solid #e9ecef; margin-top: 20px; }
        .link-output { background: #fff; border: 2px dashed #ced4da; border-radius: 8px; padding: 15px; font-weight: 600; color: #3a86ff; font-size: 15px; word-break: break-all; margin-bottom: 15px; text-align: center;}
      `}} />

      <div className="admin-wrapper">
        <div className="container">
          
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              // ... scroll ke bawah ke bagian tombol "List Link" ...
<Link href="/list" className="btn btn-default" style={{ borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #ddd', color: '#555', textDecoration: 'none' }}>
   <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>format_list_bulleted</span>
   List Link
</Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
              <div className="modern-card">
                <h2 className="brand-title">
                  <span className="material-icons notranslate" translate="no" style={{ color: '#3a86ff', fontSize: '28px' }}>rocket_launch</span>
                  SmartLink Pro
                </h2>
                <p className="brand-subtitle">Sistem otomatis generate link dan penarik judul.</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: '600', color: '#4a4e69', marginBottom: '8px' }}>Link YouTube / Offer 2 (Bot Target)</label>
                    <input type="url" name="offer2Url" className="form-control input-custom" required placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  
                  <button type="submit" className="btn btn-block btn-custom" disabled={loading}>
                    {loading ? (
                      <><span className="material-icons notranslate" translate="no" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span> Memproses...</>
                    ) : (
                      <><span className="material-icons notranslate" translate="no">bolt</span> Generate Link Sekarang</>
                    )}
                  </button>
                </form>

                {result && (
                  <div className="result-box">
                    <p style={{ fontWeight: '600', color: result.type === 'success' ? '#2b9348' : '#d90429', margin: '0 0 15px 0', fontSize: '14px', textAlign: 'center' }}>
                      {result.message}
                    </p>
                    
                    {generatedLink && (
                      <>
                        <div className="link-output">
                          {generatedLink}
                        </div>
                        <button className="btn btn-block" onClick={copyToClipboard} style={{ backgroundColor: '#2b2d42', color: '#fff', borderRadius: '8px', fontWeight: '500', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', border: 'none' }}>
                          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>content_copy</span>
                          {copyText}
                        </button>
                      </>
                    )}
                  </div>
                )}

              </div>
              
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#adb5bd' }}>
                Config Aktif: <strong>{appConfig.DOMAIN}</strong>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
