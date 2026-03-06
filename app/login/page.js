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
        // Redirect to admin panel on success
        router.push('/admin');
      } else {
        // ENGLISH error message
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      // ENGLISH connection error
      setError('Connection error. Please check server status.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Import Poppins and Icons */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* Modern & High-Quality CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        body { 
          font-family: 'Poppins', sans-serif; 
          margin: 0; 
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); 
        }
        
        /* FIX: Wrapper to prevent dempet to body edges */
        .login-container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          padding: 20px; /* Crucial spacing on mobile */
          box-sizing: border-box;
        }
        
        /* Modern Card Styling with blue accent top border */
        .login-card { 
          background: #ffffff; 
          padding: 50px 40px; 
          border-radius: 20px; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.05); 
          width: 100%; 
          max-width: 420px; 
          text-align: center; 
          border-top: 4px solid #3a86ff;
          transition: transform 0.3s ease;
        }
        
        /* Small desktop/tablet adjustment */
        @media (max-width: 480px) {
          .login-card { padding: 40px 25px; }
        }

        .icon-header { 
          display: inline-flex;
          background: #eef2ff;
          color: #3a86ff;
          border-radius: 50%;
          padding: 20px;
          margin-bottom: 25px;
        }
        
        .icon-lock { font-size: 36px; }
        
        /* FULL ENGLISH TEXTS */
        .title { font-size: 26px; font-weight: 700; color: #1d3557; margin: 0 0 8px 0; }
        .subtitle { font-size: 14px; color: #6c757d; margin-bottom: 35px; font-weight: 400; line-height: 1.5; }
        
        .input-group { position: relative; margin-bottom: 25px; text-align: left;}
        .input-label { font-size: 13px; font-weight: 500; color: #4a4e69; margin-bottom: 8px; display: block;}
        
        /* Tall, modern input style */
        .input-pass { 
          width: 100%; 
          box-sizing: border-box; 
          padding: 18px 20px; 
          border-radius: 12px; 
          border: 2px solid #edf2f4; 
          font-size: 15px; 
          font-family: 'Poppins', sans-serif; 
          transition: all 0.3s; 
          outline: none; 
          background: #fdfdfd;
          color: #2b2d42;
        }
        .input-pass:focus { border-color: #3a86ff; background: #fff; box-shadow: 0 0 0 4px rgba(58, 134, 255, 0.1); }
        
        /* Pro, large button style */
        .btn-login { 
          width: 100%; 
          background: #3a86ff; 
          color: #fff; 
          border: none; 
          padding: 18px; 
          border-radius: 12px; 
          font-size: 16px; 
          font-weight: 600; 
          cursor: pointer; 
          transition: 0.3s; 
          display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .btn-login:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(58, 134, 255, 0.3); }
        .btn-login:disabled { background: #a2c4fd; cursor: not-allowed; transform: none; }
        
        /* English error message styling */
        .error-msg { 
          background: #fee2e2; 
          color: #ef4444; 
          padding: 15px; 
          border-radius: 10px; 
          font-size: 13px; 
          font-weight: 500; 
          margin-bottom: 25px; 
          display: flex; align-items: center; gap: 8px; justify-content: center;
          border: 1px solid #fca5a5;
        }
      `}} />

      {/* Main Container FIX: Adds padding on mobile */}
      <div className="login-container">
        
        {/* Modern Card */}
        <div className="login-card">
          <div className="icon-header">
            <span className="material-icons notranslate icon-lock" translate="no">lock_person</span>
          </div>
          
          <h1 className="title">Admin Portal</h1>
          <p className="subtitle">Please sign in to manage your smart links and track hits.</p>

          {/* English error display (No JS alert) */}
          {error && (
            <div className="error-msg">
              <span className="material-icons notranslate" translate="no" style={{fontSize: '18px'}}>error_outline</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                className="input-pass" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <><span className="material-icons notranslate" translate="no" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span> Authenticating...</>
              ) : (
                <><span className="material-icons notranslate" translate="no">key</span> Sign In</>
              )}
            </button>
          </form>
        </div>

      </div>
    </>
  );
}
