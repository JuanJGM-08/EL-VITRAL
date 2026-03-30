import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

function calcularPrecio(producto: any, datos: any): number {
  const precioBase = Number(producto.precio_base || 0);
  const cantidad = Number(datos.cantidad || 0);

  if (cantidad <= 0 || precioBase <= 0) return 0;

  if (producto.tipo === 'vidrio' || producto.tipo === 'espejo') {
    const largo = Number(datos.medida_largo || 0);
    const ancho = Number(datos.medida_ancho || 0);
    if (largo <= 0 || ancho <= 0) return 0;
    const area = (largo * ancho) / 10000; // cm² a m²
    return precioBase * area * cantidad;
  }

  if (producto.tipo === 'aluminio') {
    const largo = Number(datos.medida_largo || 0);
    if (largo <= 0) return 0;
    return precioBase * (largo / 100) * cantidad;
  }

  return precioBase * cantidad;
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

    if (!cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos para crear cotización' }, { status: 400 });
    }

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!cliente.nombre || !cliente.email) {
      return NextResponse.json({ error: 'Nombre y email del cliente son obligatorios' }, { status: 400 });
    }

    let subtotal = 0;
    const detalles = [];

    for (const item of productos) {
      if (!item.producto_id || !item.cantidad) continue;

      const prod = await query('SELECT * FROM productos WHERE id = ?', [item.producto_id]);
      const producto = (prod as any[])[0];
      if (!producto) continue;

      const medidaLargo = item.medida_largo ?? null;
      const medidaAncho = item.medida_ancho ?? null;
      const cantidad = Number(item.cantidad);

      if (Number.isNaN(cantidad) || cantidad <= 0) continue;

      const itemData = {
        producto_id: item.producto_id,
        cantidad,
        medida_largo: medidaLargo,
        medida_ancho: medidaAncho,
      };

      const precio = calcularPrecio(producto, itemData);
      if (!Number.isFinite(precio)) continue;

      subtotal += precio;
      detalles.push({
        producto_id: item.producto_id,
        cantidad,
        medida_largo: medidaLargo,
        medida_ancho: medidaAncho,
        precio_unitario: precio / cantidad,
        subtotal: precio,
        descripcion: producto.nombre,
      });
    }

    if (detalles.length === 0) {
      return NextResponse.json({ error: 'No hay artículos válidos en esta cotización' }, { status: 400 });
    }

    const total = subtotal;
    const codigo = `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const result = await query(
      `INSERT INTO cotizaciones 
       (usuario_id, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, subtotal, total, codigo_unico)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        (user as any).id,
        cliente.nombre,
        cliente.email,
        cliente.telefono ?? null,
        cliente.direccion ?? null,
        subtotal,
        total,
        codigo,
      ]
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