import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, isAdmin } from '@/lib/auth';
import { getStockColumn } from '@/lib/productStock';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const stockColumn = await getStockColumn();
    const productos = await query(`
      SELECT
        id,
        nombre,
        descripcion,
        imagen_url,
        tipo,
        unidad_medida,
        precio_base,
        ${stockColumn} AS stock,
        activo
      FROM productos
      ORDER BY nombre ASC
    `);

    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, descripcion, tipo, unidad_medida, precio_base, imagen_url, stock, activo } = body;

    if (!nombre || !descripcion || !tipo || !unidad_medida || precio_base == null || stock == null) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const stockColumn = await getStockColumn();

    const insertResult = await query(
      `INSERT INTO productos (nombre, descripcion, tipo, unidad_medida, precio_base, imagen_url, ${stockColumn}, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, tipo, unidad_medida, precio_base, imagen_url, stock, activo ? 1 : 0]
    );

    const productoId = Number((insertResult as any).insertId);
    if (productoId > 0) {
      await query(
        `INSERT INTO inventario (producto_id, cantidad, tipo_movimiento, descripcion, usuario_id)
         VALUES (?, ?, 'entrada', 'Ingreso inicial de inventario al crear el producto', ?)`,
        [productoId, Number(stock), (user as any).id]
      );
    }

    return NextResponse.json({ message: 'Producto creado' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}