import { NextResponse } from 'next/server';
// 1. KITA TARIK CONFIG DARI LUAR (ROOT)
import { appConfig } from './config.js';

const isBot = (userAgent) => {
  const bots = ['facebookexternalhit', 'whatsapp', 'twitterbot', 'telegrambot'];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
};

const isSocialApp = (userAgent, referer) => {
  const apps = ['fbav', 'instagram', 'fban']; 
  const isApp = apps.some(app => userAgent.toLowerCase().includes(app));
  const isSocialReferer = referer && (referer.includes('facebook.com') || referer.includes('instagram.com'));
  return isApp || isSocialReferer;
};

export async function middleware(request) {
  const url = request.nextUrl;
  const path = url.pathname;
  const hostname = request.headers.get('host') || ''; 

  // Jangan cegat aset Next.js, halaman form admin, dan script penarik judul (API)
  if (path.startsWith('/_next') || path.includes('.') || path.startsWith('/admin') || path.startsWith('/api')) {
    return NextResponse.next();
  }

  // --- DETEKSI APAKAH INI SUBDOMAIN (stringacak) ATAU DOMAIN UTAMA ---
  // 2. KITA PAKAI DOMAIN DARI CONFIG, JADI BUKAN HARDCODE LAGI
  const domainAktif = appConfig.DOMAIN;
  const isSubdomain = hostname.includes(`.${domainAktif}`) && !hostname.startsWith('www.');
  
  let slug = null;
  let isStage1 = false;

  if (isSubdomain) {
    // Kalau diakses dari stringacak.domain.com, ambil 'stringacak'
    slug = hostname.split('.')[0]; 
    isStage1 = true;
  } else {
    // Kalau diakses dari domain.com/stringacak/title-offer2, ambil 'stringacak'
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      slug = pathParts[0];
    }
  }

  // Kalau orang cuma buka web utama, biarin nampil Coming Soon
  if (!isSubdomain && path === '/') {
    return NextResponse.next();
  }

  // Kalau gak ada string acak sama sekali, biarin lewat
  if (!slug) return NextResponse.next();

  // Siapkan kunci Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return NextResponse.next();

  // Cocokin string acak (slug) ke Supabase
  const res = await fetch(`${supabaseUrl}/rest/v1/links?string_acak=eq.${slug}&select=*`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
  
  const data = await res.json();
  const linkData = data && data.length > 0 ? data[0] : null;

  // Kalau string acak ngasal / gak ada di database
  if (!linkData) {
    return new NextResponse('Link Tidak Ditemukan (404)', { status: 404 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  // --- TAHAP 1: Akses via Subdomain (Contoh: lk1d6j.domain.com) ---
  if (isStage1) {
    if (isBot(userAgent)) {
      // Bot sosmed datang -> Lempar ke YouTube biar Preview-nya muncul
      return NextResponse.redirect(linkData.offer2_url, 301);
    } else {
      // Manusia ngeklik -> Ubah URL jadi panjang dan rapi (Pakai variabel domainAktif)
      return NextResponse.redirect(`https://${domainAktif}/${slug}/${linkData.path_tambahan}`, 302);
    }
  }

  // --- TAHAP 2: Akses via Link Rapi (Contoh: domain.com/lk1d6j/title-offer2) ---
  if (!isSubdomain) {
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 2) {
      const pathTambahan = pathParts[1];
      
      // Keamanan: Kalau URL belakangnya diubah-ubah ngasal
      if (pathTambahan !== linkData.path_tambahan) {
         return new NextResponse('Link Tidak Ditemukan (404)', { status: 404 });
      }

      // Nambahin Hit Count diam-diam
      fetch(`${supabaseUrl}/rest/v1/rpc/increment_hit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
        body: JSON.stringify({ row_id: linkData.id })
      }).catch(() => {}); 

      // Pemilahan Target Asli
      if (isSocialApp(userAgent, referer)) {
        return NextResponse.redirect(linkData.offer1_url, 301); // Dari Sosmed ke Offer 1
      } else {
        return NextResponse.redirect(linkData.offer2_url, 301); // Dari Browser ke Offer 2
      }
    }
  }

  return NextResponse.next();
}
