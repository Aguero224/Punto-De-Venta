import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function Index({ auth, clientes }) {
  const { errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
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

  const [showHistorial, setShowHistorial] = useState(false);
  const [historialData, setHistorialData] = useState([]);

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

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsLocal = {};

    // Validación de campos obligatorios (para creación, en edición algunos serán opcionales)
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

    // Para creación: email y contraseña son obligatorios.
    if (!form.id) {
      if (!form.email.trim()) {
        errorsLocal.email = "El email es obligatorio.";
      }
      if (!form.password.trim()) {
        errorsLocal.password = "La contraseña es obligatoria.";
      }
      if (form.password !== form.password_confirmation) {
        errorsLocal.password_confirmation = "Las contraseñas no coinciden.";
      }
    } else {
      // Para edición: email y contraseña son opcionales.
      // Si se ingresa contraseña, se debe confirmar.
      if (form.password.trim() && form.password !== form.password_confirmation) {
        errorsLocal.password_confirmation = "Las contraseñas no coinciden.";
      }
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    if (form.id) {
      Inertia.put(`/clientes/${form.id}`, form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/clientes';
          }
        },
      });
    } else {
      Inertia.post('/clientes', form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/clientes';
          }
        },
      });
    }
  };

  const openHistorialModal = (clientId) => {
    axios
      .get(`/clientes/${clientId}/historial`)
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

  const dataList = clientes?.data || [];

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Listado de Clientes</h2>}>
      <Head title="Clientes" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={openCreate}>Crear Cliente</button>
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
                <td className="border px-4 py-2">{cli.user ? cli.user.email : 'N/A'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => openEdit(cli)} className="text-green-500 mr-2">Editar</button>
                  <Link as="button" method="delete" href={`/clientes/${cli.id}`} className="text-red-500 mr-2">Eliminar</Link>
                  <button onClick={() => openHistorialModal(cli.id)} className="text-blue-500">Historial</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para Crear/Editar Cliente */}
      <Modal title={form.id ? 'Editar Cliente - Credenciales de usuario (Opcional)' : 'Crear Cliente'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input type="text" className="border w-full" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            {(clientErrors.nombre || errors.nombre) && <div className="text-red-600 text-sm">{clientErrors.nombre || errors.nombre}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Dirección</label>
            <input type="text" className="border w-full" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            {(clientErrors.direccion || errors.direccion) && <div className="text-red-600 text-sm">{clientErrors.direccion || errors.direccion}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teléfono</label>
            <input
              type="text"
              className="border w-full"
              value={form.telefono}
              onChange={(e) => {
                // Permitir solo dígitos en el input
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setForm({ ...form, telefono: val });
                }
              }}
            />
            {(clientErrors.telefono || errors.telefono) && <div className="text-red-600 text-sm">{clientErrors.telefono || errors.telefono}</div>}
          </div>
          <hr className="my-3" />
          <h3 className="font-semibold mb-2">Credenciales de usuario {form.id ? "(Opcional)" : ""}</h3>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" className="border w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {(clientErrors.email || errors.email) && <div className="text-red-600 text-sm">{clientErrors.email || errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input type="password" className="border w-full" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {(clientErrors.password || errors.password) && <div className="text-red-600 text-sm">{clientErrors.password || errors.password}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input type="password" className="border w-full" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
            {(clientErrors.password_confirmation || errors.password_confirmation) && <div className="text-red-600 text-sm">{clientErrors.password_confirmation || errors.password_confirmation}</div>}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Guardar</button>
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
