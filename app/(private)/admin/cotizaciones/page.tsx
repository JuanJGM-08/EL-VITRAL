'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

interface Cotizacion {
  id: number;
  usuario_id?: number;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente?: string;
  fecha_cotizacion: string;
  subtotal: number;
  total: number;
  estado: string;
  codigo_unico: string;
}

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCotizacion, setSelectedCotizacion] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      const res = await fetch('/api/admin/cotizaciones', {
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(errorData?.error || `Error en la respuesta: ${res.status} ${res.statusText}`);
        setCotizaciones([]);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        setError('Datos de cotizaciones inválidos');
        setCotizaciones([]);
      } else {
        setCotizaciones(data);
      }
    } catch (err) {
      console.error('Error al cargar cotizaciones:', err);
      setError('Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const verDetalles = async (codigo: string) => {
    try {
      const res = await fetch(`/api/cotizaciones/${codigo}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCotizacion(data);
        setShowModal(true);
      } else {
        alert('Error al cargar los detalles de la cotización');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar los detalles');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCotizacion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
              <p className="text-gray-600 mt-1">Cargando cotizaciones desde la base de datos...</p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition"
            >
              Volver
            </Link>
          </div>

          <div className="flex items-center justify-center py-16">
            <div className="text-xl text-gray-700">Cargando cotizaciones...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
            <p className="text-gray-600 mt-1">Se muestran todas las cotizaciones de la base de datos.</p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition"
          >
            Volver
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700 mb-6">
            {error}
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No hay cotizaciones registradas</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {cotizaciones.map((cotizacion) => (
                    <tr key={cotizacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cotizacion.codigo_unico}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cotizacion.nombre_cliente}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cotizacion.email_cliente}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cotizacion.fecha_cotizacion).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${Number(cotizacion.total).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            cotizacion.estado === 'vigente'
                              ? 'bg-green-100 text-green-800'
                              : cotizacion.estado === 'aprobada'
                              ? 'bg-blue-100 text-blue-800'
                              : cotizacion.estado === 'convertida'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cotizacion.estado}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => verDetalles(cotizacion.codigo_unico)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showModal && selectedCotizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Detalle de cotización</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p><strong>Código:</strong> {selectedCotizacion.codigo_unico}</p>
                <p><strong>Cliente:</strong> {selectedCotizacion.nombre_cliente}</p>
                <p><strong>Email:</strong> {selectedCotizacion.email_cliente}</p>
                <p><strong>Teléfono:</strong> {selectedCotizacion.telefono_cliente}</p>
                <p><strong>Dirección:</strong> {selectedCotizacion.direccion_cliente}</p>
                <p><strong>Fecha:</strong> {new Date(selectedCotizacion.fecha_cotizacion).toLocaleDateString()}</p>
              </div>

              <h3 className="font-bold mb-2">Productos</h3>
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-left">Medidas</th>
                    <th className="p-2 text-left">Cantidad</th>
                    <th className="p-2 text-left">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCotizacion.detalles?.map((det: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{det.descripcion}</td>
                      <td className="p-2">
                        {det.medida_largo && `${det.medida_largo}x${det.medida_ancho} cm`}
                      </td>
                      <td className="p-2">{det.cantidad}</td>
                      <td className="p-2">${det.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right">
                <p className="text-xl font-bold text-primary">Total: ${selectedCotizacion.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}