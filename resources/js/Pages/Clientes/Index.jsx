import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function Index({ auth, clientes }) {
  const { errors } = usePage().props;

  // Estado para el modal de crear/editar cliente
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Estado para el modal de historial
  const [showHistorial, setShowHistorial] = useState(false);
  const [historialData, setHistorialData] = useState([]);

  function openCreate() {
    setForm({
      id: null,
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    setShowModal(true);
  }

  function openEdit(cliente) {
    setForm({
      id: cliente.id,
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      email: cliente.user ? cliente.user.email : '',
      password: '',
      password_confirmation: '',
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.id) {
      Inertia.put(`/clientes/${form.id}`, form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/clientes';
          }
        },
        onError: () => {},
      });
    } else {
      Inertia.post('/clientes', form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/clientes';
          }
        },
        onError: () => {},
      });
    }
  }

  // Función para abrir el modal de historial
  function openHistorialModal(clientId) {
    axios
      .get(`/clientes/${clientId}/historial`)
      .then((response) => {
        setHistorialData(response.data);
        setShowHistorial(true);
      })
      .catch((error) => {
        console.error('Error al obtener historial:', error);
      });
  }

  function closeHistorialModal() {
    setShowHistorial(false);
    setHistorialData([]);
  }

  const dataList = clientes?.data ?? [];

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Listado de Clientes
        </h2>
      }
    >
      <Head title="Clientes" />

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={openCreate}
          >
            Crear Cliente
          </button>
        </div>

        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Email (User)</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((cli) => (
              <tr key={cli.id}>
                <td className="border px-4 py-2">{cli.id}</td>
                <td className="border px-4 py-2">{cli.nombre}</td>
                <td className="border px-4 py-2">
                  {cli.user ? cli.user.email : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openEdit(cli)}
                    className="text-green-500 mr-2"
                  >
                    Editar
                  </button>
                  <Link
                    as="button"
                    method="delete"
                    href={`/clientes/${cli.id}`}
                    className="text-red-500 mr-2"
                  >
                    Eliminar
                  </Link>
                  <button
                    onClick={() => openHistorialModal(cli.id)}
                    className="text-blue-500"
                  >
                    Historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar Cliente */}
      <Modal
        title={form.id ? 'Editar Cliente' : 'Crear Cliente'}
        isOpen={showModal}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              className="border w-full"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />
            {errors.nombre && (
              <div className="text-red-600 text-sm">{errors.nombre}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Dirección</label>
            <input
              type="text"
              className="border w-full"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />
            {errors.direccion && (
              <div className="text-red-600 text-sm">{errors.direccion}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono</label>
            <input
              type="text"
              className="border w-full"
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />
            {errors.telefono && (
              <div className="text-red-600 text-sm">{errors.telefono}</div>
            )}
          </div>

          <hr className="my-3" />
          <h3 className="font-semibold mb-2">Credenciales de usuario</h3>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="border w-full"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="border w-full"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {errors.password && (
              <div className="text-red-600 text-sm">{errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              className="border w-full"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Guardar
          </button>
        </form>
      </Modal>

      {/* Modal de Historial de Compras */}
      <Modal
        title="Historial de Compras"
        isOpen={showHistorial}
        onClose={closeHistorialModal}
      >
        {historialData && historialData.length > 0 ? (
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Venta ID</th>
                  <th className="border px-4 py-2">Producto</th>
                  <th className="border px-4 py-2">Cantidad</th>
                  <th className="border px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {historialData.map((venta) =>
                  venta.detalles.map((det) => (
                    <tr key={det.id}>
                      <td className="border px-4 py-2">{venta.id}</td>
                      <td className="border px-4 py-2">
                        {det.producto ? det.producto.nombre : det.producto_nombre || 'N/A'}
                      </td>
                      <td className="border px-4 py-2">{det.cantidad}</td>
                      <td className="border px-4 py-2">{det.subtotal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay historial de compras.</p>
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}
