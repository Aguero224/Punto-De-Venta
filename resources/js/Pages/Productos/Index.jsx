import React, { useState } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index() {
  const { productos, proveedores, errors } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [clientErrors, setClientErrors] = useState({});

  // Estado del formulario de producto:
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    cantidad: '',
    costo_adquisicion: '',
    precio_venta: '',
    proveedor_id: '',
  });

  // Abre modal para crear
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

  // Abre modal para editar
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

  // Abre modal para ver detalle sin redirigir
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
    let errorsLocal = {};

    // Validación de campos obligatorios
    if (!form.nombre.trim()) {
      errorsLocal.nombre = "El nombre es obligatorio.";
    }
    if (form.cantidad === '' || isNaN(form.cantidad)) {
      errorsLocal.cantidad = "La cantidad debe ser numérica.";
    }
    if (form.costo_adquisicion === '' || isNaN(form.costo_adquisicion)) {
      errorsLocal.costo_adquisicion = "El costo de adquisición debe ser numérico.";
    }
    if (form.precio_venta === '' || isNaN(form.precio_venta)) {
      errorsLocal.precio_venta = "El precio de venta debe ser numérico.";
    }
    if (
      form.costo_adquisicion !== '' &&
      form.precio_venta !== '' &&
      Number(form.precio_venta) < Number(form.costo_adquisicion)
    ) {
      errorsLocal.precio_venta = "El precio de venta debe ser mayor o igual al costo de adquisición.";
    }

    // Validación de nombre duplicado (en creación o edición)
    const allProducts = productos?.data || [];
    if (!form.id) { // creación
      const duplicate = allProducts.find(
        (p) => p.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicate) {
        errorsLocal.nombre = "Ya existe un producto con este nombre.";
      }
    } else {
      const duplicate = allProducts.find(
        (p) => p.id !== form.id && p.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
      );
      if (duplicate) {
        errorsLocal.nombre = "Ya existe un producto con este nombre.";
      }
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    // Envío de formulario (creación o edición)
    if (form.id) {
      router.put(`/productos/${form.id}`, form, {
        onSuccess: () => {
          setShowModal(false);
          router.visit('/productos');
        },
      });
    } else {
      router.post('/productos', form, {
        onSuccess: () => {
          setShowModal(false);
          router.visit('/productos');
        },
      });
    }
  };

  const dataList = productos?.data || [];

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-bold text-gray-800">Productos</h2>}>
      <Head title="Productos" />
      <div className="p-6">
        <div className="flex justify-end mb-6">
          <button 
            onClick={openCreate} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Crear Producto
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Proveedor</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{prod.id}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{prod.nombre}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">
                    {prod.proveedor ? prod.proveedor.nombre : 'Sin Proveedor'}
                  </td>
                  <td className="px-6 py-3 border-b text-sm">
                    <button onClick={() => openView(prod)} className="text-blue-500 hover:underline mr-2">
                      Ver
                    </button>
                    <button onClick={() => openEdit(prod)} className="text-green-500 hover:underline mr-2">
                      Editar
                    </button>
                    <Link
                      as="button"
                      method="delete"
                      href={`/productos/${prod.id}`}
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
        {productos.links && Array.isArray(productos.links) && (
          <div className="mt-6 flex justify-center space-x-2">
            {productos.links.map((link, index) => (
              <span key={index} className={`${link.active ? 'font-bold text-blue-600' : 'text-gray-600'} px-3 py-1 border rounded hover:bg-gray-100`}>
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
      {/* Modal de Crear/Editar Producto */}
      <Modal title={editing ? 'Editar Producto' : 'Crear Producto'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {(clientErrors.nombre || errors.nombre) && (
              <div className="text-red-500 text-sm mt-1">{clientErrors.nombre || errors.nombre}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Cantidad</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            />
            {(clientErrors.cantidad || errors.cantidad) && (
              <div className="text-red-500 text-sm mt-1">{clientErrors.cantidad || errors.cantidad}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Costo Adquisición</label>
            <input
              type="number"
              step="0.01"
              className="w-full border px-3 py-2 rounded"
              value={form.costo_adquisicion}
              onChange={(e) => setForm({ ...form, costo_adquisicion: e.target.value })}
            />
            {(clientErrors.costo_adquisicion || errors.costo_adquisicion) && (
              <div className="text-red-500 text-sm mt-1">{clientErrors.costo_adquisicion || errors.costo_adquisicion}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Precio Venta</label>
            <input
              type="number"
              step="0.01"
              className="w-full border px-3 py-2 rounded"
              value={form.precio_venta}
              onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
            />
            {(clientErrors.precio_venta || errors.precio_venta) && (
              <div className="text-red-500 text-sm mt-1">{clientErrors.precio_venta || errors.precio_venta}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Proveedor</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.proveedor_id}
              onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}
            >
              <option value="">-- Sin Proveedor --</option>
              {proveedores?.map((prov) => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>
            {errors.proveedor_id && (
              <div className="text-red-500 text-sm mt-1">{errors.proveedor_id}</div>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {editing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal de Visualización de Producto */}
      <Modal title="Detalle del Producto" isOpen={showViewModal} onClose={closeViewModal}>
        {viewProduct ? (
          <div className="p-4">
            <p className="mb-2"><strong>ID:</strong> {viewProduct.id}</p>
            <p className="mb-2"><strong>Nombre:</strong> {viewProduct.nombre}</p>
            <p className="mb-2"><strong>Cantidad:</strong> {viewProduct.cantidad}</p>
            <p className="mb-2"><strong>Costo Adquisición:</strong> {viewProduct.costo_adquisicion}</p>
            <p className="mb-2"><strong>Precio Venta:</strong> {viewProduct.precio_venta}</p>
            <p className="mb-2">
              <strong>Proveedor:</strong> {viewProduct.proveedor ? viewProduct.proveedor.nombre : 'Sin Proveedor'}
            </p>
          </div>
        ) : (
          <p className="p-4">No se pudo cargar la información.</p>
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}
