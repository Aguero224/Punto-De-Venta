import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function Index({ auth, clientes }) {
  const { errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [historialData, setHistorialData] = useState([]);
  
  // Estado para el formulario de creación/edición
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  // Estado para la búsqueda
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState(clientes.data || []);

  // Efecto para filtrar clientes por ID, Nombre o Email
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = (clientes.data || []).filter(client => {
      const idMatch = client.id.toString().includes(term);
      const nombreMatch = client.nombre.toLowerCase().includes(term);
      const emailMatch = client.user && client.user.email.toLowerCase().includes(term);
      return idMatch || nombreMatch || emailMatch;
    });
    setFilteredClients(filtered);
  }, [search, clientes.data]);

  // Abre el modal en modo crear
  const openCreate = () => {
    setForm({
      id: null,
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    setClientErrors({});
    setShowModal(true);
  };

  // Abre el modal en modo editar
  const openEdit = (cliente) => {
    setForm({
      id: cliente.id,
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      email: cliente.user ? cliente.user.email : '',
      password: '',
      password_confirmation: '',
    });
    setClientErrors({});
    setShowModal(true);
  };

  // Cierra el modal
  const closeModal = () => setShowModal(false);

  // Abre el modal de historial
  const openHistorialModal = (clientId) => {
    axios.get(`/clientes/${clientId}/historial`)
      .then((response) => {
        setHistorialData(response.data);
        setShowHistorial(true);
      })
      .catch((error) => {
        console.error("Error al obtener historial:", error);
      });
  };

  const closeHistorialModal = () => {
    setShowHistorial(false);
    setHistorialData([]);
  };

  // Manejo del envío del formulario (creación o edición)
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsLocal = {};

    if (!form.nombre.trim()) {
      errorsLocal.nombre = "El nombre es obligatorio.";
    }
    if (!form.direccion.trim()) {
      errorsLocal.direccion = "La dirección es obligatoria.";
    }
    if (!form.telefono.trim()) {
      errorsLocal.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(form.telefono)) {
      errorsLocal.telefono = "El teléfono debe contener solo números.";
    } else if (form.telefono.length < 10) {
      errorsLocal.telefono = "El teléfono debe tener al menos 10 dígitos.";
    } else if (form.telefono.length > 15) {
      errorsLocal.telefono = "El teléfono no puede tener más de 15 dígitos.";
    }
    if (!form.id) { // Creación
      if (!form.email.trim()) {
        errorsLocal.email = "El email es obligatorio.";
      }
      if (!form.password.trim()) {
        errorsLocal.password = "La contraseña es obligatoria.";
      }
      if (form.password !== form.password_confirmation) {
        errorsLocal.password_confirmation = "Las contraseñas no coinciden.";
      }
      // Validación de duplicado (nombre y email)
      const allClients = clientes.data || [];
      const duplicateNombre = allClients.find(
        (c) => c.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicateNombre) {
        errorsLocal.nombre = "Ya existe un cliente con este nombre.";
      }
      const duplicateEmail = allClients.find(
        (c) => c.user && c.user.email.toLowerCase() === form.email.trim().toLowerCase()
      );
      if (duplicateEmail) {
        errorsLocal.email = "El email ya está registrado, por favor use otro.";
      }
    } else { // Edición
      if (form.password.trim() && form.password !== form.password_confirmation) {
        errorsLocal.password_confirmation = "Las contraseñas no coinciden.";
      }
      const allClients = clientes.data || [];
      const duplicateNombre = allClients.find(
        (c) => c.id !== form.id && c.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicateNombre) {
        errorsLocal.nombre = "Ya existe un cliente con este nombre.";
      }
      if (form.email.trim()) {
        const duplicateEmail = allClients.find(
          (c) => c.id !== form.id && c.user && c.user.email.toLowerCase() === form.email.trim().toLowerCase()
        );
        if (duplicateEmail) {
          errorsLocal.email = "El email ya está registrado, por favor use otro.";
        }
      }
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    // Envío de datos: creación o actualización
    if (form.id) {
      router.put(`/clientes/${form.id}`, form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            router.visit('/clientes');
          }
        },
      });
    } else {
      router.post('/clientes', form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            router.visit('/clientes');
          }
        },
      });
    }
  };

  const dataList = clientes.data || [];

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-bold text-gray-800">Clientes</h2>}>
      <Head title="Clientes" />

      <div className="p-6">
        {/* Barra de búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Buscar por ID, Nombre o Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Crear Cliente
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Email (User)</th>
                <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((cli) => (
                <tr key={cli.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cli.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cli.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {cli.user ? cli.user.email : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => openEdit(cli)}
                      className="text-green-500 hover:underline mr-2"
                    >
                      Editar
                    </button>
                    <Link
                      as="button"
                      method="delete"
                      href={`/clientes/${cli.id}`}
                      className="text-red-500 hover:underline mr-2"
                    >
                      Eliminar
                    </Link>
                    <button
                      onClick={() => openHistorialModal(cli.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {clientes.links && Array.isArray(clientes.links) && (
          <div className="mt-6 flex justify-center space-x-2">
            {clientes.links.map((link, index) => (
              <span
                key={index}
                className={`px-3 py-1 border rounded hover:bg-gray-100 ${link.active ? 'font-bold text-blue-600' : 'text-gray-600'}`}
              >
                {link.url ? (
                  <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={form.id ? 'Editar Cliente - Credenciales de usuario (Opcional)' : 'Crear Cliente'}
        isOpen={showModal}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {(clientErrors.nombre || errors.nombre) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.nombre || errors.nombre}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Dirección</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
            {(clientErrors.direccion || errors.direccion) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.direccion || errors.direccion}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Teléfono</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.telefono}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setForm({ ...form, telefono: val });
                }
              }}
            />
            {(clientErrors.telefono || errors.telefono) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.telefono || errors.telefono}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {(clientErrors.email || errors.email) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.email || errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {(clientErrors.password || errors.password) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.password || errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
            />
            {(clientErrors.password_confirmation || errors.password_confirmation) && (
              <p className="mt-1 text-sm text-red-500">
                {clientErrors.password_confirmation || errors.password_confirmation}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              {form.id ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal de Historial de Compras */}
      <Modal title="Historial de Compras" isOpen={showHistorial} onClose={closeHistorialModal}>
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
