import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    
    // Nyamar jadi browser Chrome biar gak diblokir YouTube
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) return NextResponse.json({ title: 'viral-video' });

    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/i);
    let title = match && match[1] ? match[1] : 'viral-video';
    
    title = title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    title = title.substring(0, 50);

    return NextResponse.json({ title: title || 'viral-video' });
  } catch (error) {
    // Kalau gagal nyedot, balikin judul default, JANGAN CRASH.
    return NextResponse.json({ title: 'viral-video' }); 
  }
}
