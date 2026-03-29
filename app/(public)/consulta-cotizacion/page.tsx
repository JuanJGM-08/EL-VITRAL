'use client';
import { useState } from 'react';

export default function ConsultaCotizacionPage() {
  const [codigo, setCodigo] = useState('');
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [error, setError] = useState('');

  const buscar = async () => {
    const res = await fetch(`/api/cotizaciones/${codigo}`);
    if (res.ok) {
      const data = await res.json();
      setCotizacion(data);
      setError('');
    } else {
      setError('Código no válido');
      setCotizacion(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Consultar cotización</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Ingresa tu código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={buscar}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary"
          >
            Buscar
          </button>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        {cotizacion && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Detalle de cotización</h2>
            <div className="mb-4">
              <p><strong>Código:</strong> {cotizacion.codigo_unico}</p>
              <p><strong>Cliente:</strong> {cotizacion.nombre_cliente}</p>
              <p><strong>Email:</strong> {cotizacion.email_cliente}</p>
              <p><strong>Fecha:</strong> {new Date(cotizacion.fecha_cotizacion).toLocaleDateString()}</p>
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
                {cotizacion.detalles?.map((det: any, i: number) => (
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
              <p className="text-xl font-bold text-primary">Total: ${cotizacion.total}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}