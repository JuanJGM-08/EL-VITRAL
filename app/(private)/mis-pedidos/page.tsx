'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

interface Pedido {
  id: number;
  fecha_pedido: string;
  total: number;
  estado: string;
}

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No tienes pedidos aún.</p>
            <Link href="/catalogo" className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(pedido => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{pedido.id}</td>
                    <td className="p-3">{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td className="p-3">${pedido.total}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' : 
                          pedido.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link href={`/pedidos/${pedido.id}`} className="text-primary hover:text-secondary">
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}