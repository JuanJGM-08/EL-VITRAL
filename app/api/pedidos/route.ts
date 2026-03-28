import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const pedidos = await query(
    'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
    [(user as any).id]
  );
  return NextResponse.json(pedidos);
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { cotizacion_id, fecha_entrega } = await request.json();

  const cotizaciones = await query('SELECT * FROM cotizaciones WHERE id = ?', [cotizacion_id]);
  const cotizacion = (cotizaciones as any[])[0];
  if (!cotizacion) {
    return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
  }

  if (cotizacion.usuario_id && cotizacion.usuario_id !== (user as any).id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const result = await query(
    `INSERT INTO pedidos (cotizacion_id, usuario_id, fecha_entrega, total, estado) 
     VALUES (?, ?, ?, ?, 'pendiente')`,
    [cotizacion_id, (user as any).id, fecha_entrega, cotizacion.total]
  );

  await query('UPDATE cotizaciones SET estado = "convertida" WHERE id = ?', [cotizacion_id]);

  return NextResponse.json({ message: 'Pedido creado', id: (result as any).insertId });
}