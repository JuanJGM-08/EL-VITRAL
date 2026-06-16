'use client';
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import NavBar from '@/components/NavBar';
import { useSearchParams } from 'next/navigation';

interface Producto {
    id:number;
    nombre: string;
    tipo: string;
    descripcion: string;
    imagen_url:string | null;
    unidad_medida: string;
    precio_base: number;
}

const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function CatalogoContent() {
    const searchParams = useSearchParams();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        fetch('/api/productos')
        .then(res => res.json())
        .then(data => {
            setProductos(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const tipo = searchParams.get('tipo');
        const aplicacion = searchParams.get('aplicacion');
        const servicio = searchParams.get('servicio');

        if (tipo) {
            const tipoMapeado = tipo === 'templado' || tipo === 'laminado' ? 'vidrio' : tipo;
            setFiltro(tipoMapeado);
        } else if (aplicacion || servicio) {
            setFiltro('todos');
        }
    }, [searchParams]);

    const productosFiltrados = productos.filter(producto => {
        if (filtro === 'todos') return true;
        return producto.tipo.toLowerCase() === filtro.toLowerCase();
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#101828'}}>
                <NavBar />
                <div className="text-white text-xl">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#101828' }}>
            <NavBar />
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8">Catálogo de Productos</h1>

                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFiltro('todos')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filtro === 'todos' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFiltro('vidrio')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filtro === 'vidrio' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Vidrio
                        </button>
                        <button
                            onClick={() => setFiltro('accesorio')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filtro === 'accesorio' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Accesorios
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productosFiltrados.map(producto => (
                        <div key={producto.id} className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: '#1e2939'}}>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-700 flex items-center justify-center">
                                {producto.imagen_url ? (
                                    <Image
                                        src={producto.imagen_url}
                                        alt={producto.nombre}
                                        width={300}
                                        height={200}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center p-8">
                                        <div className="text-4xl mb-2">📦</div>
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{producto.nombre}</h3>
                                <p className="text-gray-300 mb-4">{producto.descripcion}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-primary font-bold text-lg">${formatPrice(producto.precio_base)}</span>
                                    <span className="text-gray-400 text-sm">por {producto.unidad_medida}</span>
                                </div>
                                <Link
                                    href={`/cotizar?producto=${producto.id}`}
                                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition-colors block text-center"
                                >
                                    Cotizar
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {productosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-300 text-lg">No se encontraron productos en esta categoría</p>
                    </div>
                )}

                <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                    <p className="text-white text-lg font-semibold mb-2">¿No encontraste lo que buscabas?</p>
                    <p className="text-gray-300">Llámanos al <span className="text-primary font-bold">3137928483</span> y te ayudamos a encontrar la mejor solución.</p>
                </div>
            </div>
        </div>
    );
}