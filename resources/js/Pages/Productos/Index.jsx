import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index() {
  const { productos, proveedores, errors } = usePage().props;
  // productos => paginated { data: [...] }
  // proveedores => array { id, nombre, ... }

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const [form, setForm] = useState({
    id: null,
    nombre: '',
    cantidad: 0,
    costo_adquisicion: 0,
    precio_venta: 0,
    proveedor_id: '',
  });

  function openCreate() {
    setEditing(false);
    setForm({
      id: null,
      nombre: '',
      cantidad: 0,
      costo_adquisicion: 0,
      precio_venta: 0,
      proveedor_id: '',
    });
    setShowModal(true);
  }

  function openEdit(prod) {
    setEditing(true);
    setForm({
      id: prod.id,
      nombre: prod.nombre,
      cantidad: prod.cantidad,
      costo_adquisicion: prod.costo_adquisicion,
      precio_venta: prod.precio_venta,
      proveedor_id: prod.proveedor_id || '',
    });
    setShowModal(true);
  }

  // Nueva función para abrir modal de visualización
  function openView(prod) {
    setViewProduct(prod);
    setShowViewModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function closeViewModal() {
    setShowViewModal(false);
    setViewProduct(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      Inertia.put(`/productos/${form.id}`, form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/productos';
          }
        },
        onError: () => {},
        preserveState: true,
        preserveScroll: true,
      });
    } else {
      Inertia.post('/productos', form, {
        onSuccess: (page) => {
          if (Object.keys(page.props.errors).length === 0) {
            setShowModal(false);
            window.location.href = '/productos';
          }
        },
        onError: () => {},
        preserveState: true,
        preserveScroll: true,
      });
    }
  }

  const dataList = productos?.data ?? [];

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Productos</h2>
      }
    >
      <Head title="Productos" />

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button onClick={openCreate} className="bg-green-500 text-white px-4 py-2 rounded">
            Crear Producto
          </button>
        </div>

        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Proveedor</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((prod) => (
              <tr key={prod.id}>
                <td className="border px-4 py-2">{prod.id}</td>
                <td className="border px-4 py-2">{prod.nombre}</td>
                <td className="border px-4 py-2">
                  {prod.proveedor ? prod.proveedor.nombre : 'Sin Proveedor'}
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => openView(prod)} className="text-blue-500 mr-2">
                    Ver
                  </button>
                  <button onClick={() => openEdit(prod)} className="text-green-500 mr-2">
                    Editar
                  </button>
                  <Link
                    as="button"
                    method="delete"
                    href={`/productos/${prod.id}`}
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

      {/* Modal para crear/editar producto */}
      <Modal
        title={editing ? 'Editar Producto' : 'Crear Producto'}
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
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {errors.nombre && <div className="text-red-600 text-sm">{errors.nombre}</div>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Cantidad</label>
            <input
              type="number"
              className="border w-full"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            />
            {errors.cantidad && <div className="text-red-600 text-sm">{errors.cantidad}</div>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Costo Adquisición</label>
            <input
              type="number"
              step="0.01"
              className="border w-full"
              value={form.costo_adquisicion}
              onChange={(e) => setForm({ ...form, costo_adquisicion: e.target.value })}
            />
            {errors.costo_adquisicion && (
              <div className="text-red-600 text-sm">{errors.costo_adquisicion}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Precio Venta</label>
            <input
              type="number"
              step="0.01"
              className="border w-full"
              value={form.precio_venta}
              onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
            />
            {errors.precio_venta && (
              <div className="text-red-600 text-sm">{errors.precio_venta}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Proveedor</label>
            <select
              className="border w-full"
              value={form.proveedor_id}
              onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}
            >
              <option value="">-- Sin Proveedor --</option>
              {proveedores?.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
            {errors.proveedor_id && (
              <div className="text-red-600 text-sm">{errors.proveedor_id}</div>
            )}
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            {editing ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      </Modal>

      {/* Modal de visualización de producto */}
      <Modal
        title="Detalle del Producto"
        isOpen={showViewModal}
        onClose={closeViewModal}
      >
        {viewProduct ? (
          <div className="p-4">
            <p>
              <strong>ID:</strong> {viewProduct.id}
            </p>
            <p>
              <strong>Nombre:</strong> {viewProduct.nombre}
            </p>
            <p>
              <strong>Cantidad:</strong> {viewProduct.cantidad}
            </p>
            <p>
              <strong>Costo Adquisición:</strong> {viewProduct.costo_adquisicion}
            </p>
            <p>
              <strong>Precio Venta:</strong> {viewProduct.precio_venta}
            </p>
            <p>
              <strong>Proveedor:</strong>{' '}
              {viewProduct.proveedor ? viewProduct.proveedor.nombre : 'Sin Proveedor'}
            </p>
          </div>
        ) : (
          <p>No se pudo cargar la información.</p>
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}
