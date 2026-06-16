import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getUserFromRequest, isAdmin } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const cotizaciones = await query(`
      SELECT
        c.id,
        c.usuario_id,
        c.nombre_cliente,
        c.email_cliente,
        c.telefono_cliente,
        c.fecha_cotizacion,
        c.subtotal,
        c.total,
        c.estado,
        c.codigo_unico
      FROM cotizaciones c
      ORDER BY c.fecha_cotizacion DESC
    `);

    return NextResponse.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}