import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user || (user as any).rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { estado } = await request.json();

    const estadosValidos = ['pendiente', 'en_proceso', 'listo', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    await query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, params.id]);

    return NextResponse.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}