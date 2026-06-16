'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePassword(formData.password)) {
      setError('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
      return;
    }

    setLoading(true);

    const payload = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registro exitoso. Redirigiendo al login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header con logo/imagen de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none"></div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-2xl text-white">person_add</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Crear tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Únete a nosotros y comienza tu experiencia
          </p>
        </div>

        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20 dark:border-gray-700/50">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-center text-sm">
                <span className="material-symbols-outlined text-base mr-2">error</span>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-center text-sm">
                <span className="material-symbols-outlined text-base mr-2">check_circle</span>
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="material-symbols-outlined text-base mr-2 align-middle">person</span>
                Nombre completo
              </label>
              <div className="relative">
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                  sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="material-symbols-outlined text-base mr-2 align-middle">email</span>
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                  sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="material-symbols-outlined text-base mr-2 align-middle">lock</span>
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                  sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="material-symbols-outlined text-base mr-2 align-middle">phone</span>
                Teléfono
              </label>
              <div className="relative">
                <input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                  sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="material-symbols-outlined text-base mr-2 align-middle">location_on</span>
                Dirección
              </label>
              <div className="relative">
                <input
                  name="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                  sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Calle 123 # 45-67, Ciudad"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-semibold text-white
                bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                    Registrando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">person_add</span>
                    Crear cuenta
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-green-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}