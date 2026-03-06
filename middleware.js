import { NextResponse } from 'next/server';
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

  // 1. BIARIN LEWAT UNTUK ASET SISTEM, API, DAN HALAMAN LOGIN
  if (path.startsWith('/_next') || path.includes('.') || path.startsWith('/api') || path.startsWith('/login')) {
    return NextResponse.next();
  }

  // 2. CEK KARCIS LOGIN UNTUK HALAMAN ADMIN & LIST
  if (path.startsWith('/admin') || path.startsWith('/list')) {
    const authCookie = request.cookies.get('auth_token');
    
    // Kalau nggak ada karcis (belum login), tendang ke halaman /login
    if (!authCookie || authCookie.value !== 'admin_sah') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Kalau ada karcis, silakan masuk
    return NextResponse.next();
  }

  // ... (SISA KODE KE BAWAHNYA SAMA PERSIS SEPERTI SEBELUMNYA) ...
  const domainAktif = appConfig.DOMAIN;
  const isSubdomain = hostname.includes(`.${domainAktif}`) && !hostname.startsWith('www.');
  
  let slug = null;
  let isStage1 = false;

  if (isSubdomain) {
    slug = hostname.split('.')[0]; 
    isStage1 = true;
  } else {
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      slug = pathParts[0];
    }
  }

  if (!isSubdomain && path === '/') return NextResponse.next();
  if (!slug) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return NextResponse.next();

  const res = await fetch(`${supabaseUrl}/rest/v1/links?string_acak=eq.${slug}&select=*`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
  
  const data = await res.json();
  const linkData = data && data.length > 0 ? data[0] : null;

  if (!linkData) {
    return new NextResponse('Link Tidak Ditemukan (404)', { status: 404 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  if (isStage1) {
    if (isBot(userAgent)) {
      return NextResponse.redirect(linkData.offer2_url, 301);
    } else {
      return NextResponse.redirect(`https://${domainAktif}/${slug}/${linkData.path_tambahan}`, 302);
    }
  }

  if (!isSubdomain) {
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 2) {
      const pathTambahan = pathParts[1];
      
      if (pathTambahan !== linkData.path_tambahan) {
         return new NextResponse('Link Tidak Ditemukan (404)', { status: 404 });
      }

      try {
        const angkaSekarang = linkData.hit_count || 0;
        await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${linkData.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json', 
            'apikey': supabaseKey, 
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ hit_count: angkaSekarang + 1 })
        });
      } catch (error) {
        console.log('Gagal update hit count');
      }

      if (isSocialApp(userAgent, referer)) {
        return NextResponse.redirect(linkData.offer1_url, 301); 
      } else {
        return NextResponse.redirect(linkData.offer2_url, 301); 
      }
    }
  }

  return NextResponse.next();
}
