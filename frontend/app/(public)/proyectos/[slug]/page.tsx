import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
    const slugs = ['fachada-comercial', 'divisiones-corporativas', 'barandas-residenciales'];
    return slugs.map((slug) => ({ slug }));
}

const proyectos = {
    'fachada-comercial' : {
        titulo: 'Fachada Comercial',
        descripcion: 'Instalación de vidrio templado para centro comercial',
        imagen: 'https://vidriostemplex.com/wp-content/uploads/2022/06/PHOTO-2021-11-26-11-01-21-1536x1152.jpg',
        detalles: 'Este proyecto consistió en la instalación de una fachada completa de vidrio templado de 12 mm de espesor, con estructura de aluminio anodizado. Se usó un diseño de última generación que permite máxima transparencia y eficiencia energética.',
        tecnologias: ['Vidrio Templado', 'Aluminio Anodizado', 'Sellado Estructural'],
    },
    'divisiones-corporativas': {
        titulo: 'Divisiones Corporativas',
        descripcion: 'Separadores de ambiente en vidrio laminado acústico',
        imagen: 'https://th.bing.com/th/id/R.e021e394864a3ee46e884b5f8c597845?rik=zkzo18kF9sPPNA&pid=ImgRaw&r=0',
        detalles: 'Instalación de divisiones modulares en vidrio laminado con cámara acústica para oficinas corporativas. Se logró un ambiente moderno y funcional con excelente aislamiento sonoro.',
        tecnologias: ['Vidrio Laminado', 'Perfiles de Aluminio', 'Sistemas de Fijación Invisibles'],
    },
    'barandas-residenciales': {
        titulo: 'Barandas Residenciales',
        descripcion: 'Diseño e instalación de barandas de cristal para exteriores.',
        imagen: 'https://lucor.es/wp-content/uploads/2023/01/barandillas-de-vidrio-view-crystal-03.jpg',
        detalles: 'Barandas de vidrio templado sin perfiles, fijadas con sistemas ocultos que dan seguridad y elegancia para terrazas y balcones residenciales.',
        tecnologias: ['Vidrio Templado', 'Sujeción Invisible', 'Acero Inoxidable'],
    },
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProyectoDetalle({ params }: PageProps) {
    const { slug } = await params;
    const proyecto = proyectos[slug as keyof typeof proyectos];

    if(!proyecto) {
        notFound();
    }

    return (
       <div className="min-h-screen py-10 sm:py-14" style={{ backgroundColor: '#101828'}}>
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

               <div className="rounded-2xl shadow-md overflow-hidden" style={{ backgroundColor: '#1e2939'}}>
                   <div className="p-5 sm:p-8 md:p-12">
                       <Link
                         href="/"
                         className="inline-flex items-center text-gray-400 hover:text-white mb-5 sm:mb-6 text-sm transition-colors"
                       >
                         <span className="material-symbols-outlined mr-1 text-base">arrow_back</span>
                         Volver al inicio
                       </Link>

                       <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 sm:mb-6">{proyecto.titulo}</h1>

                       {/* Hero image */}
                       <div className="relative h-56 sm:h-80 md:h-[500px] rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
                           <Image
                           src={proyecto.imagen}
                           alt={proyecto.titulo}
                           fill
                           className="object-cover"
                           unoptimized
                           />
                       </div>

                       {/* Content grid: stacks on mobile, side-by-side on lg+ */}
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                           <div className="lg:col-span-2">
                               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Sobre el Proyecto</h2>
                               <p className="text-gray-200 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">{proyecto.detalles}</p>

                               <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Tecnologías utilizadas</h3>
                               <ul className="list-disc list-inside text-gray-200 mb-6 space-y-1 text-sm sm:text-base">
                                   {proyecto.tecnologias.map((tec, idx) => (
                                     <li key={idx}>{tec}</li>
                                    ))}
                               </ul>
                           </div>

                           {/* Sidebar CTA */}
                           <div className="bg-gray-800/60 p-5 sm:p-6 rounded-xl shadow-md self-start">
                               <h3 className="text-base sm:text-lg font-bold text-white mb-3">¿Interesado en un proyecto similar?</h3>
                               <p className="text-gray-300 mb-4 text-sm">
                                   Contáctanos para recibir asesoría personalizada y cotización sin compromiso.
                               </p>
                               <Link
                                  href="/cotizar"
                                  className="inline-flex items-center justify-center w-full text-center bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary transition-colors font-semibold text-sm min-h-[44px]"
                               >
                                  Solicitar cotización
                               </Link>
                           </div>
                       </div>
                  </div>
               </div>
            </div>
        </div>
    );
}