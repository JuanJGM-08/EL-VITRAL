import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
  const usuarios = await query('SELECT id, nombre, email, telefono, direccion, rol, aprobado, ultimo_acceso FROM usuarios');
  return NextResponse.json(usuarios);
}

export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
  const { id } = await request.json();
  await query('UPDATE usuarios SET aprobado = true WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Usuario aprobado' });
}