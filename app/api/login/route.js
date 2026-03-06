import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    
    const realPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === realPassword) {
      const response = NextResponse.json({ success: true });
      
      
      
      response.cookies.set({
        name: 'auth_token',
        value: 'admin_sah',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, 
      });
      
      return response;
    }

    return NextResponse.json({ success: false, message: 'Password salah!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
