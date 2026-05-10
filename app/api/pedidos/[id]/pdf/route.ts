import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { PassThrough } from 'stream';
import { createPDFDocument, drawHeader, drawClientDetails, drawItemsTable, drawTotals, drawFooter } from '@/lib/pdfDesign';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const pedidoId = Number(id);
  if (!pedidoId || Number.isNaN(pedidoId)) {
    return new Response(JSON.stringify({ error: 'ID de pedido invalido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const pedidos = await query(
    `SELECT p.*, c.nombre_cliente, c.email_cliente, c.telefono_cliente, c.direccion_cliente, c.codigo_unico
     FROM pedidos p
     LEFT JOIN cotizaciones c ON p.cotizacion_id = c.id
     WHERE p.id = ? AND p.usuario_id = ?`,
    [pedidoId, (user as any).id]
  );

  const pedido = (pedidos as any[])[0];
  if (!pedido) {
    return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const detalles = pedido.cotizacion_id
    ? await query('SELECT * FROM cotizacion_detalles WHERE cotizacion_id = ?', [pedido.cotizacion_id])
    : [];

  const fechaPedido = new Date(pedido.fecha_pedido).toLocaleDateString('es-CO');
  const fechaEntrega = pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CO') : 'N/A';
  const subtotal = (detalles as any[]).reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);

  const doc = createPDFDocument();
  const stream = new PassThrough();
  doc.pipe(stream);

  drawHeader(doc, 'PEDIDO', String(pedido.id), fechaPedido, pedido.estado || 'N/A');
  drawClientDetails(doc, pedido, [
    { label: 'Codigo Cotizacion', value: pedido.codigo_unico || 'N/A' },
    { label: 'Pago', value: pedido.pago || 'N/A' },
    { label: 'Fecha entrega', value: fechaEntrega },
  ]);
  drawItemsTable(doc, detalles as any[]);
  drawTotals(doc, subtotal, Number(pedido.total) || 0);
  drawFooter(doc);

  doc.end();

  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pedido-${pedido.id}.pdf"`,
    },
  });
}
