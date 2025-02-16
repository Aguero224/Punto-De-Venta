import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, lista, productos }) {
  const { errors } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    producto_id: '',
    cantidad: 1,
  });

  const openCreate = () => {
    setForm({ id: null, producto_id: '', cantidad: 1 });
    setShowModal(true);
  };

  const openEdit = (item) => {
    // Solo permite editar si el producto aún existe
    if (item.producto) {
      setForm({
        id: item.id,
        producto_id: item.producto.id, // o item.producto_id
        cantidad: item.cantidad,
      });
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  function handleSubmit(e) {
    e.preventDefault();
    const onSuccess = (page) => {
      if (Object.keys(page.props.errors).length === 0) {
        setShowModal(false);
        window.location.href = '/lista-deseos';
      }
    };

    if (form.id) {
      Inertia.put(`/lista-deseos/${form.id}`, form, { onSuccess, onError: () => {} });
    } else {
      Inertia.post('/lista-deseos', form, { onSuccess, onError: () => {} });
    }
  }

  const dataList = lista?.data ?? [];
  const productList = productos ?? [];

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Lista de Deseos
        </h2>
      }
    >
      <Head title="Lista de Deseos" />

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={openCreate}
          >
            Agregar a Lista
          </button>
        </div>

        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Producto</th>
              <th className="border px-4 py-2">Cantidad</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">
                  {item.producto ? (
                    <>
                      {item.producto.nombre}{' '}
                      {Number(item.producto.cantidad) >= Number(item.cantidad) ? (
                        <span className="text-green-500 text-sm">(En stock)</span>
                      ) : (
                        <span className="text-red-500 text-sm">(No hay stock de esa cantidad)</span>
                      )}
                    </>
                  ) : (
                    <>
                      {item.producto_nombre || 'N/A'}{' '}
                      <span className="text-red-500 text-sm">(Este producto se eliminó)</span>
                    </>
                  )}
                </td>
                <td className="border px-4 py-2">{item.cantidad}</td>
                <td className="border px-4 py-2">
                  {item.producto && (
                    <button
                      onClick={() => openEdit(item)}
                      className="text-green-500 mr-2"
                    >
                      Editar
                    </button>
                  )}
                  <Link
                    as="button"
                    method="delete"
                    href={`/lista-deseos/${item.id}`}
                    className="text-red-500"
                  >
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={form.id ? 'Editar Deseo' : 'Agregar Deseo'}
        isOpen={showModal}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Producto</label>
            <select
              className="border w-full"
              value={form.producto_id}
              onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
            >
              <option value="">-- Seleccionar --</option>
              {productList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errors.producto_id && (
              <div className="text-red-600 text-sm">{errors.producto_id}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Cantidad</label>
            <input
              type="number"
              className="border w-full"
              min={1}
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            />
            {errors.cantidad && (
              <div className="text-red-600 text-sm">{errors.cantidad}</div>
            )}
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Guardar
          </button>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}
