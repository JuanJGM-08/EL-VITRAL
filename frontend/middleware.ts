// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    console.log('🔑 Token:', token);

    if (!token) {
      console.log('❌ No hay token, redirigiendo a login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decodificar sin verificar (para ver el contenido)
      const decoded: any = jwt.decode(token);
      console.log('📦 Decoded (sin verificar):', decoded);

      // También intentar verificar con el secreto
      try {
        const verified = jwt.verify(token, JWT_SECRET);
        console.log('✅ Verified:', verified);
      } catch (verifyErr) {
        console.log('⚠️ Error al verificar:', verifyErr.message);
      }

      if (!decoded) {
        console.log('❌ No se pudo decodificar, redirigiendo a login');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (decoded.rol !== 'admin') {
        console.log(`❌ Rol incorrecto: "${decoded.rol}", redirigiendo a /`);
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('✅ Acceso permitido a /admin');
      return NextResponse.next();
    } catch (err) {
      console.error('❌ Error en middleware:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};