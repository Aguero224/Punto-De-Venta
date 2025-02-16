import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, ventas, clientes, productos }) {
  const { errors } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    cliente_id: '',
    productos: [], 
  });

  function openCreate() {
    setForm({ id: null, cliente_id: '', productos: [] });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.id) {
      Inertia.put(`/ventas/${form.id}`, form, {
        onSuccess: () => {
          setShowModal(false);
          window.location.href = '/ventas';
        },
        onError: () => {},
      });
    } else {
      Inertia.post('/ventas', form, {
        onSuccess: () => {
          setShowModal(false);
          window.location.href = '/ventas';
        },
        onError: () => {},
      });
    }
  }

  function addItem() {
    setForm({
      ...form,
      productos: [...form.productos, { id: '', cantidad: 1 }],
    });
  }

  function handleItemChange(index, field, value) {
    const newArr = form.productos.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, productos: newArr });
  }

  const ventasList = ventas?.data ?? [];
  const clientesList = clientes ?? [];
  const productosList = productos ?? [];

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
                        : `${det.producto_nombre || 'N/A'} `}
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
              <option value="">-- Seleccionar Cliente --</option>
              {clientesList.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.cliente_id && <div className="text-red-600 text-sm">{errors.cliente_id}</div>}
          </div>
          <div className="mb-4 border p-2">
            <button type="button" onClick={addItem} className="bg-blue-500 text-white px-2 py-1">
              + Agregar Producto
            </button>
            {form.productos.map((item, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <select
                  className="border"
                  value={item.id}
                  onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                >
                  <option value="">-- Seleccionar Producto --</option>
                  {productosList.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="border w-20"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                />
              </div>
            ))}
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
