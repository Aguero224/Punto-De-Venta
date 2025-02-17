import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, ventas, clientes, productos }) {
  const { errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario de venta:
  // cliente_id es opcional; productos es un array de { id, cantidad }
  const [form, setForm] = useState({
    id: null,
    cliente_id: '',
    productos: [],
  });

  // Abre el modal para crear (o editar) venta
  const openCreate = () => {
    setForm({ id: null, cliente_id: '', productos: [] });
    setClientErrors({});
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Agrega una nueva fila para un producto
  const addItem = () => {
    // Sólo permitir agregar si aún quedan productos no seleccionados
    if (form.productos.length < productos.length) {
      setForm({
        ...form,
        productos: [...form.productos, { id: '', cantidad: '' }],
      });
    }
  };

  // Remueve una fila de producto según el índice
  const removeItem = (index) => {
    const newItems = form.productos.filter((_, i) => i !== index);
    setForm({ ...form, productos: newItems });
  };

  // Maneja el cambio en cada fila (producto y cantidad)
  const handleItemChange = (index, field, value) => {
    const newItems = form.productos.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, productos: newItems });
  };

  // Función de validación local del formulario de venta
  const validateVentaForm = () => {
    let errorsLocal = {};

    if (form.productos.length === 0) {
      errorsLocal.productos = "Debes agregar al menos un producto.";
    } else {
      form.productos.forEach((item, index) => {
        if (!item.id) {
          errorsLocal[`productos_${index}_id`] = "Selecciona un producto.";
        }
        if (!item.cantidad || isNaN(item.cantidad) || Number(item.cantidad) <= 0) {
          errorsLocal[`productos_${index}_cantidad`] = "La cantidad debe ser mayor a 0.";
        } else {
          const prod = productos.find((p) => p.id === Number(item.id));
          if (prod && Number(item.cantidad) > Number(prod.cantidad)) {
            errorsLocal[`productos_${index}_cantidad`] =
              "No hay stock de esa cantidad, por favor pon una cantidad menor.";
          }
        }
      });
    }

    return errorsLocal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateVentaForm();
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    } else {
      setClientErrors({});
    }

    if (form.id) {
      Inertia.put(`/ventas/${form.id}`, form, {
        onSuccess: () => {
          setShowModal(false);
          window.location.href = '/ventas';
        },
      });
    } else {
      Inertia.post('/ventas', form, {
        onSuccess: () => {
          setShowModal(false);
          window.location.href = '/ventas';
        },
      });
    }
  };

  // Listados
  const ventasList = ventas?.data || [];
  const clientesList = clientes || [];
  const productosList = productos || [];

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ventas</h2>}>
      <Head title="Ventas" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button onClick={openCreate} className="bg-green-500 text-white px-4 py-2">
            Registrar Venta
          </button>
        </div>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Productos</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventasList.map((v) => (
              <tr key={v.id}>
                <td className="border px-4 py-2">{v.id}</td>
                <td className="border px-4 py-2">
                  {v.cliente ? v.cliente.nombre : 'Venta sin cliente'}
                </td>
                <td className="border px-4 py-2">
                  {v.detalles?.map((det) => (
                    <div key={det.id}>
                      {det.producto
                        ? `${det.producto.nombre} (x${det.cantidad})`
                        : `${det.producto_nombre || 'N/A'} (x${det.cantidad})`}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">{v.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal title={form.id ? 'Editar Venta' : 'Registrar Venta'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Cliente</label>
            <select
              className="border w-full"
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            >
              <option value="">-- Seleccionar Cliente (Opcional) --</option>
              {clientesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.cliente_id && <div className="text-red-600 text-sm">{errors.cliente_id}</div>}
          </div>
          <div className="mb-4 border p-2">
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 text-white px-2 py-1"
              disabled={form.productos.length >= productosList.length}
            >
              + Agregar Producto
            </button>
            {form.productos.length === 0 && (
              <div className="text-red-600 text-sm">Debes agregar al menos un producto.</div>
            )}
            {/* Si hay más de 4 filas, se aplica scroll */}
            <div className={form.productos.length > 4 ? "max-h-60 overflow-y-auto" : ""}>
              {form.productos.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1 mt-2">
                  <div className="flex items-center space-x-2">
                    <select
                      className="border"
                      value={item.id}
                      onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                    >
                      <option value="">-- Seleccionar Producto --</option>
                      {productosList
                        .filter(
                          (p) =>
                            // Permitir si este producto ya está seleccionado en la fila actual o no se ha seleccionado en otra fila
                            form.productos.every((it, i) => i === index || Number(it.id) !== p.id)
                        )
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-2 py-1 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                  {clientErrors[`productos_${index}_id`] && (
                    <div className="text-red-600 text-sm">
                      {clientErrors[`productos_${index}_id`]}
                    </div>
                  )}
                  <input
                    type="number"
                    min="1"
                    className="border w-20"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                  />
                  {clientErrors[`productos_${index}_cantidad`] && (
                    <div className="text-red-600 text-sm">
                      {clientErrors[`productos_${index}_cantidad`]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.productos && <div className="text-red-600 text-sm">{errors.productos}</div>}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Guardar
          </button>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}
