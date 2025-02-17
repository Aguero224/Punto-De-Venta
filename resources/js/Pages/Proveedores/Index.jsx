import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index() {
  const { proveedores, errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredProviders, setFilteredProviders] = useState(proveedores.data || []);

  // Estado del formulario para crear/editar proveedor
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
  });

  // Efecto para filtrar proveedores por ID y Nombre cuando cambia el input de búsqueda
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = (proveedores.data || []).filter((prov) => {
      const idMatch = prov.id.toString().includes(term);
      const nombreMatch = prov.nombre.toLowerCase().includes(term);
      return idMatch || nombreMatch;
    });
    setFilteredProviders(filtered);
  }, [search, proveedores.data]);

  // Abre el modal para crear un proveedor
  function openCreate() {
    setForm({ id: null, nombre: '', direccion: '', telefono: '' });
    setClientErrors({});
    setShowModal(true);
  }

  // Abre el modal para editar un proveedor
  function openEdit(prov) {
    setForm({
      id: prov.id,
      nombre: prov.nombre,
      direccion: prov.direccion,
      telefono: prov.telefono,
    });
    setClientErrors({});
    setShowModal(true);
  }

  // Cierra el modal
  function closeModal() {
    setShowModal(false);
  }

  // Función que se ejecuta al enviar el formulario
  function handleSubmit(e) {
    e.preventDefault();
    let errorsLocal = {};

    // Validación de campos obligatorios
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

    // Validación de nombre duplicado
    const allProviders = proveedores.data || [];
    if (!form.id) { // En creación
      const duplicate = allProviders.find(
        (p) => p.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicate) {
        errorsLocal.nombre = "El proveedor con este nombre ya existe.";
      }
    } else { // En edición
      const duplicate = allProviders.find(
        (p) => p.id !== form.id && p.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicate) {
        errorsLocal.nombre = "El proveedor con este nombre ya existe.";
      }
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    // Envío de datos (creación o edición)
    if (form.id) {
      router.put(`/proveedores/${form.id}`, form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            router.visit('/proveedores');
          }
        },
        onError: () => {},
      });
    } else {
      router.post('/proveedores', form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            router.visit('/proveedores');
          }
        },
        onError: () => {},
      });
    }
  }

  const dataList = proveedores.data || [];

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Proveedores</h2>}>
      <Head title="Proveedores" />

      <div className="p-6">
        {/* Barra de búsqueda moderna */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Buscar por ID o Nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Crear Proveedor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Dirección</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProviders.map((prov) => (
                <tr key={prov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{prov.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{prov.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{prov.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{prov.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button onClick={() => openEdit(prov)} className="text-green-500 hover:underline mr-2">
                      Editar
                    </button>
                    <Link
                      as="button"
                      method="delete"
                      href={`/proveedores/${prov.id}`}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {proveedores.links && Array.isArray(proveedores.links) && (
          <div className="mt-6 flex justify-center space-x-2">
            {proveedores.links.map((link, index) => (
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

      <Modal title={form.id ? 'Editar Proveedor' : 'Crear Proveedor'} isOpen={showModal} onClose={closeModal}>
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
          <div className="flex justify-end">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              {form.id ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}
