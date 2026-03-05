import { NextResponse } from 'next/server';

// Daftar Bot Sosmed (Bisa ditambah nanti)
const isBot = (userAgent) => {
  const bots = ['facebookexternalhit', 'whatsapp', 'twitterbot', 'telegrambot'];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
};

// Deteksi dari Aplikasi Sosmed
const isSocialApp = (userAgent, referer) => {
  const apps = ['fbav', 'instagram']; // FBAV = Facebook In-App Browser
  const isApp = apps.some(app => userAgent.toLowerCase().includes(app));
  const isSocialReferer = referer && (referer.includes('facebook.com') || referer.includes('instagram.com'));
  return isApp || isSocialReferer;
};

export async function middleware(request) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Lewati file sistem Next.js dan halaman utama (/)
  if (path.startsWith('/_next') || path.includes('.') || path === '/') {
    return NextResponse.next();
  }

  // Pecah URL. Contoh: /stringacak/title-offer2
  const pathParts = path.split('/').filter(Boolean);
  const slug = pathParts[0]; 
  const pathTambahan = pathParts[1]; 

  // Ambil kunci Supabase dari Environment Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Cek Data ke Supabase (Kita pakai fetch REST API agar sangat cepat)
  const res = await fetch(`${supabaseUrl}/rest/v1/links?string_acak=eq.${slug}&select=*`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
  
  const data = await res.json();
  const linkData = data && data.length > 0 ? data[0] : null;

  // Jika string_acak tidak ada di Supabase -> Alihkan ke 404
  if (!linkData) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  // --- TAHAP 1: Akses /stringacak ---
  if (pathParts.length === 1) {
    if (isBot(userAgent)) {
      // BOT FB DATANG: Langsung tembak ke Offer 2 untuk generate Preview Card
      return NextResponse.redirect(linkData.offer2_url, 301);
    } else {
      // MANUSIA DATANG: Ubah URL jadi rapi (/stringacak/title-offer2)
      return NextResponse.redirect(new URL(`/${slug}/${linkData.path_tambahan}`, request.url), 302);
    }
  }

  // --- TAHAP 2: Akses URL Rapi (/stringacak/title-offer2) ---
  if (pathParts.length === 2) {
    // Keamanan ekstra: Jika user ngetik "path_tambahan" ngasal, buang ke 404
    if (pathTambahan !== linkData.path_tambahan) {
       return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    // Hit Count Update (Berjalan di background agar redirect tetap ngebut)
    fetch(`${supabaseUrl}/rest/v1/rpc/increment_hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
      body: JSON.stringify({ row_id: linkData.id })
    }).catch(err => console.error(err)); // Abaikan error agar user tidak terganggu

    // Cek asal kedatangan Manusia
    if (isSocialApp(userAgent, referer)) {
      // Dari dalam aplikasi Sosmed -> Ke Offer 1
      return NextResponse.redirect(linkData.offer1_url, 301); 
    } else {
      // Browser biasa (Chrome, Safari, dsb) -> Ke Offer 2
      return NextResponse.redirect(linkData.offer2_url, 301); 
    }
  }

  return NextResponse.next();
}
