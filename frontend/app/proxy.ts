import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const publicPaths = [
    '/',
    '/catalogo',
    '/cotizar',
    '/sobre-nosotros',
    '/login',
    '/registro',
    '/olvide-password',
    '/reset-password',
    '/consulta-cotizacion'
  ];

  if (publicPaths.includes(path) || path.startsWith('/api')) {
    return NextResponse.next();
  }

  if (path.startsWith('/proyectos/')) {
    return NextResponse.next();
  }

  if (path.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    const decoded = jwt.decode(token as string) as any;
    if (!decoded) return NextResponse.redirect(new URL('/login', request.url));
    if (decoded.rol !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
