"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        // Kalau sukses, langsung arahin ke halaman admin
        router.push('/admin');
      } else {
        setError('Password salah bro! Coba lagi.');
      }
    } catch (err) {
      setError('Gagal koneksi ke server.');
    }
    setLoading(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{__html: `
        body { font-family: 'Poppins', sans-serif; background-color: #f4f7f6; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .login-card { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); width: 100%; max-width: 400px; text-align: center; }
        .icon-lock { font-size: 48px; color: #3a86ff; margin-bottom: 15px; }
        .title { font-size: 24px; font-weight: 700; color: #1d3557; margin: 0 0 5px 0; }
        .subtitle { font-size: 14px; color: #6c757d; margin-bottom: 30px; }
        .input-pass { width: 100%; box-sizing: border-box; padding: 15px; border-radius: 10px; border: 2px solid #edf2f4; font-size: 15px; font-family: 'Poppins', sans-serif; transition: all 0.3s; margin-bottom: 20px; outline: none; }
        .input-pass:focus { border-color: #3a86ff; }
        .btn-login { width: 100%; background: #3a86ff; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-login:hover { background: #2563eb; }
        .error-msg { background: #fee2e2; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
      `}} />

      <div className="login-card">
        <span className="material-icons notranslate icon-lock" translate="no">lock</span>
        <h1 className="title">Admin Area</h1>
        <p className="subtitle">Masukkan password untuk melanjutkan.</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Password..." 
            className="input-pass" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Mengecek...' : 'Masuk Sistem'}
          </button>
        </form>
      </div>
    </>
  );
}
