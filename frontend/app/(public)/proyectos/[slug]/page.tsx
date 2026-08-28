'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Proyecto {
  id: number;
  titulo: string;
  slug: string;
  resumen: string;
  descripcion: string | null;
  imagen_url: string;
  tecnologias: string | null;
}

export default function ProyectoDetalle() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [status, setStatus] = useState<'loading' | 'not-found' | 'error' | 'ready'>('loading');

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function loadProject() {
      try {
        setStatus('loading');
        const response = await fetch(`/api/proyectos/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          setStatus('not-found');
          return;
        }
        if (!response.ok) throw new Error('No fue posible cargar el proyecto');

        setProyecto(await response.json());
        setStatus('ready');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setStatus('error');
      }
    }

    loadProject();
    return () => controller.abort();
  }, [slug]);

  if (status === 'loading') return <StatusMessage message="Cargando proyecto..." />;
  if (status === 'not-found') return <StatusMessage message="No encontramos el proyecto solicitado." />;
  if (status === 'error' || !proyecto) return <StatusMessage message="No fue posible cargar este proyecto. Inténtalo nuevamente." />;

  const tecnologias = (proyecto.tecnologias || '')
    .split(',')
    .map((tecnologia) => tecnologia.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#101828] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-[#1e2939] shadow-md">
          <div className="p-8 md:p-12">
            <h1 className="mb-6 text-4xl font-bold text-white">{proyecto.titulo}</h1>
            <div className="relative mb-8 h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Image src={proyecto.imagen_url} alt={proyecto.titulo} fill className="object-cover" unoptimized />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="mb-4 text-2xl font-bold text-white">Sobre el proyecto</h2>
                <p className="mb-6 leading-relaxed text-gray-200">{proyecto.descripcion || proyecto.resumen}</p>

                {tecnologias.length > 0 && (
                  <>
                    <h3 className="mb-3 text-xl font-bold text-white">Materiales y tecnologías utilizadas</h3>
                    <ul className="mb-6 list-inside list-disc text-gray-200">
                      {tecnologias.map((tecnologia) => <li key={tecnologia}>{tecnologia}</li>)}
                    </ul>
                  </>
                )}
              </div>

              <div className="rounded-lg bg-gray-800/50 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-white">¿Interesado en un proyecto similar?</h3>
                <p className="mb-4 text-gray-200">Contáctanos para recibir asesoría personalizada y una cotización sin compromiso.</p>
                <Link href="/cotizar" className="inline-block w-full rounded-md bg-blue-600 py-2 text-center text-white transition-colors hover:bg-blue-500">
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

function StatusMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101828] px-4">
      <div className="rounded-xl bg-[#1e2939] px-6 py-5 text-center text-gray-200 shadow-lg">
        <p>{message}</p>
        <Link href="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">Volver al inicio</Link>
      </div>
    </div>
  );
}
