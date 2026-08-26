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
    <div className="bg-[#0d131f] text-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[650px] flex items-center justify-center border-b border-gray-800">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://forbes.es/wp-content/uploads/2022/03/California-2.jpg"
            alt="Modern Glass Architecture Background"
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/70 to-black/60"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl px-4 text-center">
          <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full inline-block mb-4">
            Innovación en Vidriería
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-md">
            ¿Buscando nuevas <span className="text-cyan-400">instalaciones de vidrio</span>?
          </h1>

          {/* Buscador de filtros */}
          <div className="bg-[#161f30]/90 backdrop-blur-md border border-gray-700/60 p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <select
                value={filtros.tipoVidrio}
                onChange={(e) => handleFiltroChange('tipoVidrio', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 bg-gray-900/80 border border-gray-700/80 rounded-xl focus:border-cyan-500 focus:outline-none text-white font-medium text-sm cursor-pointer transition-colors"
              >
                <option value="" className="bg-[#161f30]">Tipo de Vidrio</option>
                <option value="templado" className="bg-[#161f30]">Vidrio Templado</option>
                <option value="laminado" className="bg-[#161f30]">Vidrio Laminado</option>
                <option value="espejo" className="bg-[#161f30]">Espejos</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <select
                value={filtros.aplicacion}
                onChange={(e) => handleFiltroChange('aplicacion', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 bg-gray-900/80 border border-gray-700/80 rounded-xl focus:border-cyan-500 focus:outline-none text-white font-medium text-sm cursor-pointer transition-colors"
              >
                <option value="" className="bg-[#161f30]">Aplicación</option>
                <option value="ventanas" className="bg-[#161f30]">Ventanas</option>
                <option value="puertas" className="bg-[#161f30]">Puertas</option>
                <option value="divisiones" className="bg-[#161f30]">Divisiones</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <select
                value={filtros.servicio}
                onChange={(e) => handleFiltroChange('servicio', e.target.value)}
                className="w-full h-12 sm:h-14 pl-4 pr-10 bg-gray-900/80 border border-gray-700/80 rounded-xl focus:border-cyan-500 focus:outline-none text-white font-medium text-sm cursor-pointer transition-colors"
              >
                <option value="" className="bg-[#161f30]">Servicios</option>
                <option value="fabricacion" className="bg-[#161f30]">Fabricación</option>
                <option value="instalacion" className="bg-[#161f30]">Instalación</option>
                <option value="mantenimiento" className="bg-[#161f30]">Mantenimiento</option>
              </select>
            </div>

            <button
              onClick={handleBuscar}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold h-12 sm:h-14 px-8 rounded-xl transition-all text-sm w-full md:w-auto shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
            >
              <span>Buscar</span>
              <span className="text-lg">🔍</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proyectos Destacados */}
      <section className="py-20 bg-[#0d131f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-2">Portafolio</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Proyectos destacados
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Descubre nuestros últimos trabajos en cristalería e instalaciones a medida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Proyecto 1 */}
            <Link 
              href="/proyectos/fachada-comercial" 
              className="bg-[#161f30] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="h-60 overflow-hidden relative">
                  <Image
                    src="https://vidriostemplex.com/wp-content/uploads/2022/06/PHOTO-2021-11-26-11-01-21-1536x1152.jpg"
                    alt="Fachada de Vidrio Comercial"
                    width={400}
                    height={256}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    Fachada Comercial
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Instalación de vidrio templado de alta resistencia para centro comercial.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center text-cyan-400 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Ver detalles</span>
                <span className="ml-1 text-sm">→</span>
              </div>
            </Link>

            {/* Proyecto 2 */}
            <Link 
              href="/proyectos/divisiones-corporativas" 
              className="bg-[#161f30] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="h-60 overflow-hidden relative">
                  <Image
                    src="https://th.bing.com/th/id/R.e021e394864a3ee46e884b5f8c597845?rik=zkzo18kF9sPPNA&pid=ImgRaw&r=0"
                    alt="Divisiones de Oficina de Vidrio"
                    width={400}
                    height={256}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    Divisiones Corporativas
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Separadores de ambiente en vidrio laminado acústico para oficinas modernas.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center text-cyan-400 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Ver detalles</span>
                <span className="ml-1 text-sm">→</span>
              </div>
            </Link>

            {/* Proyecto 3 */}
            <Link 
              href="/proyectos/barandas-residenciales" 
              className="bg-[#161f30] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="h-60 overflow-hidden relative">
                  <Image
                    src="https://lucor.es/wp-content/uploads/2023/01/barandillas-de-vidrio-view-crystal-03.jpg"
                    alt="Barandas de vidrio Residencial"
                    width={400}
                    height={256}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    Barandas Residenciales
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Diseño e instalación de barandas de cristal templado para balcones y terrazas.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center text-cyan-400 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                <span>Ver detalles</span>
                <span className="ml-1 text-sm">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Reseñas y Ubicación */}
      <ReviewsCarousel />
      <LocationSection />
    </div>
  );
}