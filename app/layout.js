import { Poppins } from 'next/font/google'; // Gunakan Google Font resmi via Next.js


// Konfigurasi Font Poppins agar teroptimasi otomatis oleh Vercel
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // Buat variabel CSS
});

// ======================================================================
// 🌐 GLOBAL METADATA & SEO CONFIGURATION (ENGLISH)
// Halaman ini mengatur apa yang dilihat browser dan sosial media.
// ======================================================================
export const metadata = {
  // 1. Basic Metadata
  title: {
    default: 'SmartLink Pro - Effortless Redirect Manager',
    template: '%s | SmartLink Pro', // Buat judul dinamis di halaman lain
  },
  description: 'Instantly generate smart redirect links with automated title fetching and traffic routing based on user device.',
  
  // 2. Language & Region Settings (English)
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },

  // 3. 🖼️ ICON CONFIGURATION (Browser Tab Icon)
  // Pastikan file-file ini ada di folder /public lu di GitHub.
  icons: {
    icon: '/shortcut-icon.png', // Icon standar (ukuran 16x16 atau 32x32)
    shortcut: '/shortcut-icon.png',
    apple: '/shortcut-icon.png', // Icon khusus perangkat Apple (180x180)
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/shortcut-icon.png',
      },
    ],
  },

  // 4. 🔗 OPEN GRAPH / SOCIAL MEDIA META TAGS (ENGLISH)
  // Ini menentukan tampilan saat link utama https://copbhghuytr.eu.org/ di-share.
  openGraph: {
    title: 'SmartLink Pro - Smart Redirects & Traffic Routing',
    description: 'Optimize your marketing campaigns with dynamic links that adapt to users and bots.',
    url: 'https://copbhghuytr.eu.org', // Ganti dengan domain aktif lu
    siteName: 'SmartLink Pro',
    
    // ⭐ META TAG GAMBAR PREVIEW (PENTING!)
    // Pastikan file 'og-image.png' ada di folder /public lu di GitHub.
    // Ukuran rekomendasi: 1200 x 630 piksel untuk hasil terbaik di FB/WA.
    images: [
      {
        url: '/og-image.png', // Path relatif dari folder public
        width: 1200,
        height: 630,
        alt: 'SmartLink Pro App Preview - Smart Redirect Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // 5. Twitter Specific Tags
  twitter: {
    card: 'summary_large_image',
    title: 'SmartLink Pro - Redirect Manager',
    description: 'Generate dynamic marketing links with automated routing.',
    images: ['/og-image.png'], // Gunakan gambar yang sama dengan OG
  },
};

export default function RootLayout({ children }) {
  return (
    // 🌍 SET BAHASA KE INGGRIS
    <html lang="en">
      {/* Terapkan font Poppins dan styling dasar body */}
      <body 
        className={poppins.className} 
        style={{ 
          margin: 0, 
          padding: 0, 
          backgroundColor: '#f4f7f6', // Warna background kalem ala Admin Panel
          minHeight: '100vh',
          color: '#2b2d42'
        }}
      >
        {children}
      </body>
    </html>
  );
}
