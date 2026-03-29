import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.rol !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

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