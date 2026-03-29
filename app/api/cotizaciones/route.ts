import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

function calcularPrecio(producto: any, datos: any): number {
  const precioBase = producto.precio_base;
  if (producto.tipo === 'vidrio' || producto.tipo === 'espejo') {
    // Precio por metro cuadrado: precio_base es el precio por m²
    const area = (datos.medida_largo * datos.medida_ancho) / 10000; // Convertir cm² a m²
    return precioBase * area * datos.cantidad;
  } else if (producto.tipo === 'aluminio') {
    return precioBase * (datos.medida_largo / 100) * datos.cantidad; // precio por metro lineal
  }
  return precioBase * datos.cantidad;
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const cotizaciones = await query(
      'SELECT * FROM cotizaciones WHERE usuario_id = ? ORDER BY fecha_cotizacion DESC',
      [(user as any).id]
    );
    return NextResponse.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cliente, productos } = await request.json();
    const user = getUserFromRequest(request);

    let subtotal = 0;
    const detalles = [];

    for (const item of productos) {
      const prod = await query('SELECT * FROM productos WHERE id = ?', [item.producto_id]);
      const producto = (prod as any[])[0];
      if (!producto) continue;
      const precio = calcularPrecio(producto, item);
      subtotal += precio;
      detalles.push({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        medida_largo: item.medida_largo,
        medida_ancho: item.medida_ancho,
        precio_unitario: precio / item.cantidad,
        subtotal: precio,
        descripcion: producto.nombre,
      });
    }

    const total = subtotal; // Total sin IVA
    const codigo = `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const result = await query(
      `INSERT INTO cotizaciones 
       (usuario_id, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, subtotal, total, codigo_unico)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user ? (user as any).id : null, cliente.nombre, cliente.email, cliente.telefono, cliente.direccion, subtotal, total, codigo]
    );

    const cotizacionId = (result as any).insertId;

    for (const det of detalles) {
      await query(
        `INSERT INTO cotizacion_detalles 
         (cotizacion_id, producto_id, descripcion, cantidad, medida_largo, medida_ancho, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [cotizacionId, det.producto_id, det.descripcion, det.cantidad, det.medida_largo, det.medida_ancho, det.precio_unitario, det.subtotal]
      );
    }

    return NextResponse.json({ message: 'Cotización creada', codigo });
  } catch (error: any) {
    console.error('Error detallado al crear cotización:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({
      error: 'Error al crear cotización',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}