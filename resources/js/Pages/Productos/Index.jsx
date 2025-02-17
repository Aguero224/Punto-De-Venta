import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index() {
  const { productos, proveedores, errors } = usePage().props;
  // Se elimina la propiedad "filters" ya que no se usa la búsqueda
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [clientErrors, setClientErrors] = useState({});

  const [form, setForm] = useState({
    id: null,
    nombre: '',
    cantidad: '',
    costo_adquisicion: '',
    precio_venta: '',
    proveedor_id: '',
  });

  const openCreate = () => {
    setEditing(false);
    setForm({
      id: null,
      nombre: '',
      cantidad: '',
      costo_adquisicion: '',
      precio_venta: '',
      proveedor_id: '',
    });
    setClientErrors({});
    setShowModal(true);
  };

  const openEdit = (prod) => {
    setEditing(true);
    setForm({
      id: prod.id,
      nombre: prod.nombre,
      cantidad: prod.cantidad,
      costo_adquisicion: prod.costo_adquisicion,
      precio_venta: prod.precio_venta,
      proveedor_id: prod.proveedor_id || '',
    });
    setClientErrors({});
    setShowModal(true);
  };

  // Modal para ver detalle del producto sin redirigir
  const openView = (prod) => {
    setViewProduct(prod);
    setShowViewModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeViewModal = () => {
    setShowViewModal(false);
    setViewProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones client-side
    let errors = {};

    if (!form.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }
    if (form.cantidad === '' || isNaN(form.cantidad)) {
      errors.cantidad = "La cantidad debe ser numérica";
    }
    if (form.costo_adquisicion === '' || isNaN(form.costo_adquisicion)) {
      errors.costo_adquisicion = "El costo de adquisición debe ser numérico";
    }
    if (form.precio_venta === '' || isNaN(form.precio_venta)) {
      errors.precio_venta = "El precio de venta debe ser numérico";
    }
    if (
      form.costo_adquisicion !== '' &&
      form.precio_venta !== '' &&
      Number(form.precio_venta) < Number(form.costo_adquisicion)
    ) {
      errors.precio_venta = "El precio de venta debe ser mayor o igual al costo de adquisición";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    } else {
      setClientErrors({});
    }

    if (editing) {
      Inertia.put(`/productos/${form.id}`, form, {
        onSuccess: () => setShowModal(false),
        preserveState: true,
        preserveScroll: true,
      });
    } else {
      Inertia.post('/productos', form, {
        onSuccess: () => setShowModal(false),
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  const dataList = productos?.data || [];

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Productos</h2>}>
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
                <td className="border px-4 py-2">{prod.proveedor ? prod.proveedor.nombre : 'Sin Proveedor'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => openView(prod)} className="text-blue-500 mr-2">Ver</button>
                  <button onClick={() => openEdit(prod)} className="text-green-500 mr-2">Editar</button>
                  <Link as="button" method="delete" href={`/productos/${prod.id}`} className="text-red-500">
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal title={editing ? 'Editar Producto' : 'Crear Producto'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              className="border w-full"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {(clientErrors.nombre || errors.nombre) && (
              <div className="text-red-600 text-sm">{clientErrors.nombre || errors.nombre}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Cantidad</label>
            <input
              type="number"
              className="border w-full"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            />
            {(clientErrors.cantidad || errors.cantidad) && (
              <div className="text-red-600 text-sm">{clientErrors.cantidad || errors.cantidad}</div>
            )}
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
            {(clientErrors.costo_adquisicion || errors.costo_adquisicion) && (
              <div className="text-red-600 text-sm">{clientErrors.costo_adquisicion || errors.costo_adquisicion}</div>
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
            {(clientErrors.precio_venta || errors.precio_venta) && (
              <div className="text-red-600 text-sm">{clientErrors.precio_venta || errors.precio_venta}</div>
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
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
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
      <Modal title="Detalle del Producto" isOpen={showViewModal} onClose={closeViewModal}>
        {viewProduct ? (
          <div className="p-4">
            <p><strong>ID:</strong> {viewProduct.id}</p>
            <p><strong>Nombre:</strong> {viewProduct.nombre}</p>
            <p><strong>Cantidad:</strong> {viewProduct.cantidad}</p>
            <p><strong>Costo Adquisición:</strong> {viewProduct.costo_adquisicion}</p>
            <p><strong>Precio Venta:</strong> {viewProduct.precio_venta}</p>
            <p>
              <strong>Proveedor:</strong> {viewProduct.proveedor ? viewProduct.proveedor.nombre : 'Sin Proveedor'}
            </p>
          </div>
        ) : (
          <p>No se pudo cargar la información.</p>
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}
