import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params; 
    const body = await request.json();
    const { estado, pago } = body;

    if (!estado && !pago) {
      return NextResponse.json({ error: 'Estado o pago requerido' }, { status: 400 });
    }

    if (estado) {
      await query(
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [estado, id]
      );
    }

    if (pago) {
      await query(
        'UPDATE pedidos SET pago = ? WHERE id = ?',
        [pago, id]
      );
    }

    return NextResponse.json({ message: 'Pedido actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pedido' },
      { status: 500 }
    );
  }
}