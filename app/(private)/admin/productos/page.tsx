'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url?: string;
  activo: boolean;
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/admin/productos', { credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.error || `${res.status} ${res.statusText}`;
        setError(`No autorizado: ${message}`);
        setProductos([]);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        setError('Datos de productos inválidos');
        setProductos([]);
        return;
      }

      setProductos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 ELIMINAR / HABILITAR
  const eliminarProducto = async (id: number) => {
    const confirmar = confirm('¿Seguro que quieres eliminar este producto?');

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchProductos();
        alert('Se eliminó exitosamente');
      } else {
        const errorData = await res.json();
        alert(`Error al eliminar: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔄 HABILITAR
  const habilitarProducto = async (id: number) => {
    const confirmar = confirm('¿Seguro que quieres habilitar este producto?');

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/admin/productos/${id}/habilitar`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (res.ok) {
        fetchProductos();
        alert('Producto habilitado exitosamente');
      } else {
        const errorData = await res.json();
        alert(`Error al habilitar: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✏️ EDITAR
  const editarProducto = async (producto: Producto) => {
    const nuevoNombre = prompt('Nuevo nombre:', producto.nombre);
    if (!nuevoNombre) return;

    const nuevaDescripcion = prompt('Nueva descripción:', producto.descripcion);
    if (!nuevaDescripcion) return;

    try {
      const res = await fetch(`/api/admin/productos/${producto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: nuevoNombre,
          descripcion: nuevaDescripcion
        })
      });

      if (res.ok) {
        fetchProductos();
        alert('Edición exitosa');
      } else {
        const errorData = await res.json();
        alert(`Error al editar: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>

          <Link href="/admin" className="bg-gray-900 text-white px-4 py-2 rounded">
            Volver
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className={`border-t ${!p.activo ? 'bg-gray-100 opacity-60' : ''}`}>
                  <td className="p-4 flex gap-3 items-center">
                    {p.imagen_url && (
                      <img src={p.imagen_url} className="w-10 h-10 rounded" />
                    )}
                    {p.nombre}
                    {!p.activo && <span className="text-red-500 text-sm">(Inactivo)</span>}
                  </td>

                  <td className="p-4">{p.descripcion}</td>

                  <td className="p-4">
                    <button
                      onClick={() => editarProducto(p)}
                      className="text-blue-600 mr-4"
                      disabled={!p.activo}
                    >
                      Editar
                    </button>

                    {p.activo ? (
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <button
                        onClick={() => habilitarProducto(p.id)}
                        className="text-green-600"
                      >
                        Habilitar
                      </button>
                    )}
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