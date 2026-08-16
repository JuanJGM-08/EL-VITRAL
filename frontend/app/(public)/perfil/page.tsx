'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  direccion?: string;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setError('No se pudo cargar el usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#101828' }}>
        <p className="text-white">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#101828' }}>
        <p className="text-red-400">{error || 'Usuario no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Responsive grid: stacks on mobile, side-by-side on lg */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[300px_1fr]">

          {/* Left panel: avatar + contact info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-sky-500 text-3xl sm:text-4xl font-bold text-white shadow-lg shadow-sky-500/20">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sky-400">Bienvenido</p>
                <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-white">{user.nombre}</h1>
              </div>
              <span className="rounded-full bg-slate-800 px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-300">
                {user.rol}
              </span>
            </div>

            <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-400">Correo electrónico</p>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base font-medium text-white break-all">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-400">Teléfono</p>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base font-medium text-white">{user.telefono || 'No registrado'}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-400">Dirección</p>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base font-medium text-white">{user.direccion || 'No registrada'}</p>
              </div>
            </div>
          </div>

          {/* Right panel: account details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-col gap-5 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sky-400 mb-3">Detalles de la cuenta</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-slate-400">ID de usuario</p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-white">{user.id}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-slate-400">Último acceso</p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-white">Hoy</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Tu espacio está listo</h2>
                <p className="text-slate-400 leading-7 text-sm sm:text-base">
                  Puedes revisar tus cotizaciones, actualizar tus datos y mantener tu cuenta segura. Si deseas cambiar tu información de contacto, contáctanos y te apoyamos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons: stacked on mobile, side-by-side on sm+ */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/perfil/editar"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-semibold text-white text-center transition hover:border-slate-500 min-h-[48px]"
          >
            <span className="material-symbols-outlined mr-2 text-base">edit</span>
            Editar perfil
          </Link>
          <Link
            href="/cotizaciones"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-semibold text-white text-center transition hover:border-slate-500 min-h-[48px]"
          >
            <span className="material-symbols-outlined mr-2 text-base">receipt_long</span>
            Ver mis cotizaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
