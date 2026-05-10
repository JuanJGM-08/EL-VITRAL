import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { PassThrough } from 'stream';
import { createPDFDocument, drawHeader, drawClientDetails, drawItemsTable, drawTotals, drawFooter } from '@/lib/pdfDesign';

export async function GET(request: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const user = getUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const cotizaciones = await query('SELECT * FROM cotizaciones WHERE codigo_unico = ? AND usuario_id = ?', [codigo, (user as any).id]);
  const cotizacion = (cotizaciones as any[])[0];
  if (!cotizacion) {
    return new Response(JSON.stringify({ error: 'Cotizacion no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const detalles = await query('SELECT * FROM cotizacion_detalles WHERE cotizacion_id = ?', [cotizacion.id]);
  const fecha = new Date(cotizacion.fecha_cotizacion).toLocaleDateString('es-CO');

  const doc = createPDFDocument();
  const stream = new PassThrough();
  doc.pipe(stream);

  drawHeader(doc, 'COTIZACION', cotizacion.codigo_unico, fecha, cotizacion.estado || 'N/A');
  drawClientDetails(doc, cotizacion, [
    { label: 'Codigo', value: cotizacion.codigo_unico },
    { label: 'Fecha', value: fecha },
    { label: 'Estado', value: cotizacion.estado || 'N/A' },
  ]);
  drawItemsTable(doc, detalles as any[]);
  drawTotals(doc, Number(cotizacion.subtotal) || 0, Number(cotizacion.total) || 0);
  drawFooter(doc);

  doc.end();

  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cotizacion-${cotizacion.codigo_unico}.pdf"`,
    },
  });
}
