export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6', // Sesuai dengan warna dasar layout lu
      textAlign: 'center',
      padding: '20px',
      color: '#2b2d42'
    }}>
      
      {/* CSS Khusus untuk Efek Animasi Melayang & Kedap-Kedip */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-text {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .svg-illustration {
          animation: float 4s ease-in-out infinite;
          margin-bottom: 40px;
        }
        .main-heading {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 15px;
          letter-spacing: -0.8px;
          color: #1d3557;
        }
        .sub-heading {
          font-size: 1.15rem;
          color: #6c757d;
          max-width: 450px;
          line-height: 1.6;
          font-weight: 400;
          animation: pulse-text 3s infinite;
        }
        
        /* Penyesuaian ukuran font untuk HP */
        @media (max-width: 600px) {
          .main-heading { font-size: 2rem; }
          .sub-heading { font-size: 1rem; }
        }
      `}} />

      {/* Gambar SVG Murni (Tanpa perlu file external) */}
      <div className="svg-illustration">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#3a86ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
           {/* Sayap Kiri */}
           <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" fill="#a2d2ff" stroke="#3a86ff"/>
           {/* Sayap Kanan */}
           <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" fill="#a2d2ff" stroke="#3a86ff"/>
           {/* Api Bawah */}
           <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="#ffb703" stroke="#fb8500" strokeWidth="1.5"/>
           {/* Badan Roket */}
           <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="#3a86ff" stroke="#2563eb" strokeWidth="1.2"/>
           {/* Kaca Jendela Roket */}
           <circle cx="14.5" cy="9.5" r="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1"/>
           
           {/* Bintang-Bintang Dekorasi di Luar Roket */}
           <path d="M2 4l1 1m0-1l-1 1" stroke="#ffb703" strokeWidth="1.5"/>
           <path d="M21 20l1 1m0-1l-1 1" stroke="#ffb703" strokeWidth="1.5"/>
           <path d="M18 5l1 1m0-1l-1 1" stroke="#a2d2ff" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Teks Bahasa Inggris Tanpa Box */}
      <h1 className="main-heading">Launching Soon</h1>
      <p className="sub-heading">
        We are crafting something amazing. <br/> 
        Our SmartLink system is currently under preparation and will be live shortly.
      </p>

    </div>
  );
}
