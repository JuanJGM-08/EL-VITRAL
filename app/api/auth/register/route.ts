import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, sanitizeEmail, sanitizeString } from '@/lib/auth';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

export async function POST(request: NextRequest) {
  try {
    const { nombre: rawNombre, email: rawEmail, password: rawPassword, telefono: rawTelefono, direccion: rawDireccion } = await request.json();
    const nombre = sanitizeString(rawNombre);
    let email: string;
    try {
      email = sanitizeEmail(rawEmail);
    } catch {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    const password = sanitizeString(rawPassword);
    const telefono = sanitizeString(rawTelefono);
    const direccion = sanitizeString(rawDireccion);

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const result = await query(
      'INSERT INTO usuarios (nombre, email, password, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hashed, telefono || null, direccion || null]
    );

    return NextResponse.json({ message: 'Usuario registrado' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Register error:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json(
      {
        error: 'Error en el servidor',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}