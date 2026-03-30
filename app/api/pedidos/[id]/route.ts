import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const pedidos = await query('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?', [id, (user as any).id]);
  const pedido = (pedidos as any[])[0];

  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado o no autorizado' }, { status: 404 });
  }

  let detalles = [];
  let cotizacion = null;

  if (pedido.cotizacion_id) {
    const cotizaciones = await query('SELECT * FROM cotizaciones WHERE id = ?', [pedido.cotizacion_id]);
    cotizacion = (cotizaciones as any[])[0] || null;

    detalles = await query(
      `SELECT d.*, p.nombre as producto_nombre, p.tipo as producto_tipo
       FROM cotizacion_detalles d
       LEFT JOIN productos p ON d.producto_id = p.id
       WHERE d.cotizacion_id = ?`,
      [pedido.cotizacion_id]
    );
  }

  return NextResponse.json({ ...pedido, cotizacion, detalles });
}
