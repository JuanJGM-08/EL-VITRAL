import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (user) {
    try {
      await query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [(user as any).id]);
    } catch (error) {
      console.error('Error actualizando ultimo_acceso en logout:', error);
    }
  }

  const response = NextResponse.json({ message: 'Cierre de sesión exitoso' });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
