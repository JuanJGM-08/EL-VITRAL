'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import LocationSection from '@/components/LocationSection';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [filtros, setFiltros] = useState({
    tipoVidrio: '',
    aplicacion: '',
    servicio: ''
  });

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (filtros.tipoVidrio) params.set('tipo', filtros.tipoVidrio);
    if (filtros.aplicacion) params.set('aplicacion', filtros.aplicacion);
    if (filtros.servicio) params.set('servicio', filtros.servicio);

    router.push(`/catalogo${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <>
      {/* Hero section */}
      <div className="relative h-[480px] sm:h-[560px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://forbes.es/wp-content/uploads/2022/03/California-2.jpg"
            alt="Modern Glass Architecture Background"
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/55"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md leading-tight">
            ¿Buscando nuevas instalaciones de vidrio?
          </h1>
          {/* Search bar */}
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-xl shadow-xl flex flex-col sm:flex-row gap-2">
            {/* Tipo de Vidrio */}
            <div className="flex-1 relative">
              <select
                value={filtros.tipoVidrio}
                onChange={(e) => handleFiltroChange('tipoVidrio', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 appearance-none bg-transparent border-0 border-b-2 sm:border-b-0 sm:border-r-2 border-gray-200 dark:border-gray-700 focus:ring-0 text-black dark:text-white font-medium text-base cursor-pointer"
              >
                <option value="">Tipo de Vidrio</option>
                <option value="templado">Vidrio Templado</option>
                <option value="laminado">Vidrio Laminado</option>
                <option value="espejo">Espejos</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-black dark:text-white pointer-events-none text-xl">
                expand_more
              </span>
            </div>
            {/* Aplicación */}
            <div className="flex-1 relative">
              <select
                value={filtros.aplicacion}
                onChange={(e) => handleFiltroChange('aplicacion', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 appearance-none bg-transparent border-0 border-b-2 sm:border-b-0 sm:border-r-2 border-gray-200 dark:border-gray-700 focus:ring-0 text-black dark:text-white font-medium text-base cursor-pointer"
              >
                <option value="">Aplicación</option>
                <option value="ventanas">Ventanas</option>
                <option value="puertas">Puertas</option>
                <option value="divisiones">Divisiones</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-black dark:text-white pointer-events-none text-xl">
                expand_more
              </span>
            </div>
            {/* Servicios */}
            <div className="flex-1 relative">
              <select
                value={filtros.servicio}
                onChange={(e) => handleFiltroChange('servicio', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 appearance-none bg-transparent border-0 focus:ring-0 text-black dark:text-white font-medium text-base cursor-pointer"
              >
                <option value="">Servicios</option>
                <option value="fabricacion">Fabricación</option>
                <option value="instalacion">Instalación</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-black dark:text-white pointer-events-none text-xl">
                expand_more
              </span>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-primary hover:bg-secondary text-white font-bold h-12 sm:h-14 px-6 sm:px-10 rounded-lg transition-colors text-base w-full sm:w-auto min-h-[44px]"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Proyectos destacados */}
      <section className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Proyectos destacados
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Descubre nuestros últimos trabajos en cristalería e instalaciones
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Link href="/proyectos/fachada-comercial" className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="h-52 sm:h-64 overflow-hidden">
                <Image
                  src="https://vidriostemplex.com/wp-content/uploads/2022/06/PHOTO-2021-11-26-11-01-21-1536x1152.jpg"
                  alt="Fachada de Vidrio Comercial"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Fachada Comercial
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                  Instalación de vidrio templado para centro comercial.
                </p>
                <div className="flex items-center text-primary dark:text-blue-400 font-medium text-sm">
                  Ver detalles{' '}
                  <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>

            <Link href="/proyectos/divisiones-corporativas" className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="h-52 sm:h-64 overflow-hidden">
                <Image
                  src="https://th.bing.com/th/id/R.e021e394864a3ee46e884b5f8c597845?rik=zkzo18kF9sPPNA&pid=ImgRaw&r=0"
                  alt="Divisiones de Oficina de Vidrio"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Divisiones Corporativas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                  Separadores de ambiente en vidrio laminado acústico.
                </p>
                <div className="flex items-center text-primary dark:text-blue-400 font-medium text-sm">
                  Ver detalles{' '}
                  <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>

            <Link href="/proyectos/barandas-residenciales" className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="h-52 sm:h-64 overflow-hidden">
                <Image
                  src="https://lucor.es/wp-content/uploads/2023/01/barandillas-de-vidrio-view-crystal-03.jpg"
                  alt="Barandas de vidrio Residencial"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  Barandas Residenciales
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                  Diseño e instalación de barandas de cristal para exteriores.
                </p>
                <div className="flex items-center text-primary dark:text-blue-400 font-medium text-sm">
                  Ver detalles{' '}
                  <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Carrusel de reseñas */}
      <ReviewsCarousel />

      {/* Sección de ubicación */}
      <LocationSection />
    </>
  );
}