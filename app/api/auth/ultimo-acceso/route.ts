import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [(user as any).id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando ultimo_acceso:', error);
    return NextResponse.json({ error: 'No se pudo registrar el último acceso.' }, { status: 500 });
  }
}
