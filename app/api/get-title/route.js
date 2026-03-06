import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    
    // Nembak ke URL Offer 2 buat ngambil isi halamannya
    const response = await fetch(url);
    const html = await response.text();
    
    // Nyari tag <title> di dalem HTML-nya
    const match = html.match(/<title>(.*?)<\/title>/i);
    let title = match && match[1] ? match[1] : 'promo-link';
    
    // Bersihin judul: buang simbol, ganti spasi jadi strip, kecilin huruf
    title = title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    
    // Potong biar kepanjangan gak bikin error URL
    title = title.substring(0, 60);

    return NextResponse.json({ title });
  } catch (error) {
    return NextResponse.json({ title: 'promo-link' }); 
  }
}
