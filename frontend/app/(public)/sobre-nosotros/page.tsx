import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default async function SobreNosotros() {

    return (
        <div className="min-h-screen py-10 sm:py-14" style={{ backgroundColor: '#101828'}}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="rounded-2xl shadow-md overflow-hidden" style={{backgroundColor: '#1e2939'}}>
                    {/* Hero image */}
                    <div className="relative h-48 sm:h-64 md:h-80">
                        <Image
                          src="https://img.freepik.com/fotos-premium/tecnico-que-corta-vidrios-tamano-artesanal-precision-instalacion-produccion-ventanas_964444-31536.jpg"
                          alt="Taller de vidrio"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg px-4 text-center">Sobre Nosotros</h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 md:p-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                            Más de 10 años dando forma a tus ideas
                        </h2>

                        <p className="text-gray-100 leading-relaxed mb-6 text-sm sm:text-base">
                            En <strong>El Vitral</strong> somos una empresa familiar con más de diez años de experiencia en el sector del vidrio y la cristalería. Nacimos con la pasión por transformar espacios a través de la luz y la transparencia, ofreciendo soluciones a medida para proyectos residenciales, comerciales e industriales.
                        </p>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Nuestra misión</h3>
                        <p className="text-gray-100 leading-relaxed mb-6 text-sm sm:text-base">
                            Brindar el mejor producto y servicio de alta calidad en vidrio, combinando innovación, seguridad y diseño, para crear ambientes funcionales y estéticamente superiores. Nos comprometemos con la satisfacción de nuestros clientes, la excelencia en cada detalle y el respeto por el medio ambiente.
                        </p>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                            ¿Qué nos hace diferentes?
                        </h3>
                        <ul className="list-disc list-inside text-gray-100 space-y-2 mb-6 text-sm sm:text-base">
                            <li>Asesoría personalizada desde el primer contacto.</li>
                            <li>Materiales de primera calidad y procesos certificados.</li>
                            <li>Instalación profesional con garantía.</li>
                            <li>Atención postventa y mantenimiento.</li>
                            <li>Capacidad para desarrollar proyectos a gran escala.</li>
                        </ul>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                            Nuestro equipo
                        </h3>

                        <p className="text-gray-100 leading-relaxed mb-6 text-sm sm:text-base">
                            Contamos con un equipo de artesanos, diseñadores y técnicos especializados que trabajan en conjunto para convertir tus ideas en realidad. Cada proyecto es único, y lo tratamos como tal.
                        </p>

                        <div className="bg-black/20 p-5 sm:p-6 rounded-xl text-center mt-6 sm:mt-8">
                          <h4 className="text-base sm:text-lg font-semibold text-white mb-3">
                            ¿Tienes un proyecto en mente? Cotiza con nosotros y hagamos realidad tu visión.
                          </h4>
                          <Link
                            href="/cotizar"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-semibold text-sm sm:text-base min-h-[44px]"
                          >
                            Solicita una Cotización
                          </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}