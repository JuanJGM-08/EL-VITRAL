import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

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

  // Allow public paths and API routes
  if (publicPaths.includes(path) || path.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check for dynamic routes like /proyectos/[slug]
  if (path.startsWith('/proyectos/')) {
    return NextResponse.next();
  }

  // Protect private routes
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
