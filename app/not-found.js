import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6', // Sesuai dengan warna dasar tema lu
      textAlign: 'center',
      padding: '20px',
      color: '#2b2d42'
    }}>
      
      {/* CSS Khusus untuk Efek Animasi Melayang UFO */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-ufo {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes beam-flicker {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        .ufo-illustration {
          animation: float-ufo 4s ease-in-out infinite;
          margin-bottom: 30px;
        }
        .ufo-beam {
          animation: beam-flicker 2s infinite;
        }
        .error-heading {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -1px;
          color: #1d3557;
        }
        .error-sub {
          font-size: 1.15rem;
          color: #6c757d;
          max-width: 400px;
          line-height: 1.6;
          font-weight: 400;
          margin-bottom: 30px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #3a86ff;
          color: #fff;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .back-btn:hover {
          background-color: #2563eb;
          box-shadow: 0 4px 15px rgba(58, 134, 255, 0.3);
          transform: translateY(-2px);
        }
        
        @media (max-width: 600px) {
          .error-heading { font-size: 2.2rem; }
          .error-sub { font-size: 1rem; }
        }
      `}} />

      {/* Gambar SVG Murni: UFO Sedot 404 */}
      <div className="ufo-illustration">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#3a86ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
           {/* Cahaya Sedotan (Beam) */}
           <path className="ufo-beam" d="M6 14l-2 8h16l-2-8" fill="#e0eaf5" stroke="none" />
           {/* Kubah Kaca UFO */}
           <path d="M8 9a4 4 0 0 1 8 0" fill="#a2d2ff" stroke="#3a86ff" strokeWidth="1.2"/>
           {/* Alien di dalam */}
           <circle cx="12" cy="8" r="1.5" fill="#1d3557" stroke="none" />
           {/* Badan UFO */}
           <ellipse cx="12" cy="11" rx="8" ry="3" fill="#3a86ff" stroke="#2563eb" strokeWidth="1.5"/>
           {/* Lampu-lampu UFO */}
           <circle cx="7" cy="11" r="0.6" fill="#ffffff" stroke="none" />
           <circle cx="12" cy="11.5" r="0.6" fill="#ffffff" stroke="none" />
           <circle cx="17" cy="11" r="0.6" fill="#ffffff" stroke="none" />
           
           {/* Teks 404 Melayang ditarik UFO */}
           <text x="12" y="19" fontFamily="system-ui, sans-serif" fontSize="4.5" fontWeight="800" fill="#1d3557" textAnchor="middle">404</text>
           
           {/* Bintang Dekorasi */}
           <path d="M3 4l1 1m0-1l-1 1" stroke="#ffb703" strokeWidth="1"/>
           <path d="M21 5l1 1m0-1l-1 1" stroke="#ffb703" strokeWidth="1"/>
        </svg>
      </div>

      {/* Teks & Tombol */}
      <h1 className="error-heading">Lost in Space</h1>
      <p className="error-sub">
        Oops! The page you are looking for has vanished into thin air or never existed.
      </p>

      {/* Tombol Kembali menggunakan Next/Link */}
      <Link href="/" className="back-btn">
        <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>arrow_back</span>
        Return to Home
      </Link>

    </div>
  );
}
