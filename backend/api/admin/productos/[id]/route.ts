import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);

  if (!user || (user as any).rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;

    await query('DELETE FROM productos WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);

  if (!user || (user as any).rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion } = body;

    await query(
      'UPDATE productos SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion, id]
    );

    return NextResponse.json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error('Error al editar producto:', error);
    return NextResponse.json(
      { error: 'Error al editar producto' },
      { status: 500 }
    );
  }
}
