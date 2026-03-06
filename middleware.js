import { NextResponse } from 'next/server';

const isBot = (userAgent) => {
  const bots = ['facebookexternalhit', 'whatsapp', 'twitterbot', 'telegrambot'];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
};

const isSocialApp = (userAgent, referer) => {
  const apps = ['fbav', 'instagram']; 
  const isApp = apps.some(app => userAgent.toLowerCase().includes(app));
  const isSocialReferer = referer && (referer.includes('facebook.com') || referer.includes('instagram.com'));
  return isApp || isSocialReferer;
};

export async function middleware(request) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Lewati file sistem Next.js dan halaman form admin biar gak error 500
  if (path.startsWith('/_next') || path.includes('.') || path === '/' || path.startsWith('/admin')) {
    return NextResponse.next();
  }

  const pathParts = path.split('/').filter(Boolean);
  const slug = pathParts[0]; 
  const pathTambahan = pathParts[1]; 

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return NextResponse.next();

  // Ambil data dari Supabase
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

  // TAHAP 1: Klik pertama kali
  if (pathParts.length === 1) {
    if (isBot(userAgent)) {
      return NextResponse.redirect(linkData.offer2_url, 301);
    } else {
      return NextResponse.redirect(new URL(`/${slug}/${linkData.path_tambahan}`, request.url), 302);
    }
  }

  // TAHAP 2: Pemilahan Manusia
  if (pathParts.length === 2) {
    if (pathTambahan !== linkData.path_tambahan) {
       return new NextResponse('Link Tidak Ditemukan (404)', { status: 404 });
    }

    // Hit Count Background (Abaikan error biar gak ganggu redirect)
    fetch(`${supabaseUrl}/rest/v1/rpc/increment_hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
      body: JSON.stringify({ row_id: linkData.id })
    }).catch(() => {}); 

    if (isSocialApp(userAgent, referer)) {
      return NextResponse.redirect(linkData.offer1_url, 301); 
    } else {
      return NextResponse.redirect(linkData.offer2_url, 301); 
    }
  }

  return NextResponse.next();
}
