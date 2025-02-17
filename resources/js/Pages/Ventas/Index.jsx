import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, ventas, clientes, productos }) {
  const { errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario de venta
  const [form, setForm] = useState({
    id: null,
    cliente_id: '',
    productos: [],
  });

  // Estado para la búsqueda
  const [search, setSearch] = useState('');
  const [filteredVentas, setFilteredVentas] = useState(ventas.data || []);

  // Actualiza la lista filtrada cuando cambie el input o los datos
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = (ventas.data || []).filter((v) => {
      const idMatch = v.id.toString().includes(term);
      const clienteMatch =
        v.cliente && v.cliente.nombre.toLowerCase().includes(term);
      const productosMatch =
        v.detalles &&
        v.detalles.some((det) => {
          const prodName = det.producto
            ? det.producto.nombre.toLowerCase()
            : det.producto_nombre
            ? det.producto_nombre.toLowerCase()
            : '';
          return prodName.includes(term);
        });
      return idMatch || clienteMatch || productosMatch;
    });
    setFilteredVentas(filtered);
  }, [search, ventas.data]);

  // Funciones para abrir y cerrar el modal de crear/editar venta
  const openCreate = () => {
    setForm({ id: null, cliente_id: '', productos: [] });
    setClientErrors({});
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Manejo de la lista de productos en el formulario
  const addItem = () => {
    if (form.productos.length < productos.length) {
      setForm({
        ...form,
        productos: [...form.productos, { id: '', cantidad: '' }],
      });
    }
  };

  const removeItem = (index) => {
    const newItems = form.productos.filter((_, i) => i !== index);
    setForm({ ...form, productos: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = form.productos.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, productos: newItems });
  };

  // Validación y envío del formulario (validación incluida en handleSubmit)
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsLocal = {};

    if (form.productos.length === 0) {
      errorsLocal.productos = "Debes agregar al menos un producto.";
    } else {
      form.productos.forEach((item, index) => {
        if (!item.id) {
          errorsLocal[`productos_${index}_id`] = "Selecciona un producto.";
        }
        if (
          !item.cantidad ||
          isNaN(item.cantidad) ||
          Number(item.cantidad) <= 0
        ) {
          errorsLocal[`productos_${index}_cantidad`] =
            "La cantidad debe ser mayor a 0.";
        } else {
          const prod = productos.find((p) => p.id === Number(item.id));
          if (prod && Number(item.cantidad) > Number(prod.cantidad)) {
            errorsLocal[`productos_${index}_cantidad`] =
              "No hay stock de esa cantidad, por favor pon una cantidad menor.";
          }
        }
      });
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    if (form.id) {
      router.put(`/ventas/${form.id}`, form, {
        onSuccess: () => {
          setShowModal(false);
          router.visit('/ventas');
        },
      });
    } else {
      router.post('/ventas', form, {
        onSuccess: () => {
          setShowModal(false);
          router.visit('/ventas');
        },
      });
    }
  };

  const ventasList = filteredVentas; // Se usa la lista filtrada
  const clientesList = clientes || [];
  const productosList = productos || [];

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-bold text-gray-800">Ventas</h2>}>
      <Head title="Ventas" />
      <div className="p-6">
        {/* Barra de búsqueda moderna */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Buscar por ID, Cliente o Producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mt-2 md:mt-0"
          >
            Registrar Venta
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Productos</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventasList.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{v.id}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">
                    {v.cliente ? v.cliente.nombre : 'Venta sin cliente'}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">
                    {v.detalles?.map((det) => (
                      <div key={det.id}>
                        {det.producto
                          ? `${det.producto.nombre} (x${det.cantidad})`
                          : `${det.producto_nombre || 'N/A'} (x${det.cantidad})`}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{v.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        {ventas.links && Array.isArray(ventas.links) && (
          <div className="mt-6 flex justify-center space-x-2">
            {ventas.links.map((link, index) => (
              <span
                key={index}
                className={`${link.active ? 'font-bold text-blue-600' : 'text-gray-600'} px-3 py-1 border rounded hover:bg-gray-100`}
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
      <Modal title={form.id ? 'Editar Venta' : 'Registrar Venta'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Cliente</label>
            <select
              className="w-full border px-3 py-2 rounded"
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
            {errors.cliente_id && (
              <div className="text-red-500 text-sm mt-1">{errors.cliente_id}</div>
            )}
          </div>
          <div className="border p-3 rounded space-y-3">
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              disabled={form.productos.length >= productosList.length}
            >
              + Agregar Producto
            </button>
            {form.productos.length === 0 && (
              <div className="text-red-500 text-sm">Debes agregar al menos un producto.</div>
            )}
            <div className={form.productos.length > 4 ? "max-h-60 overflow-y-auto" : ""}>
              {form.productos.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <select
                      className="border px-2 py-1 rounded"
                      value={item.id}
                      onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                    >
                      <option value="">-- Seleccionar Producto --</option>
                      {productosList
                        .filter((p) =>
                          form.productos.every(
                            (it, i) => i === index || Number(it.id) !== p.id
                          )
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
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                  {clientErrors[`productos_${index}_id`] && (
                    <div className="text-red-500 text-sm">{clientErrors[`productos_${index}_id`]}</div>
                  )}
                  <input
                    type="number"
                    min="1"
                    className="border px-2 py-1 rounded w-24"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                  />
                  {clientErrors[`productos_${index}_cantidad`] && (
                    <div className="text-red-500 text-sm">{clientErrors[`productos_${index}_cantidad`]}</div>
                  )}
                </div>
              ))}
            </div>
            {errors.productos && (
              <div className="text-red-500 text-sm">{errors.productos}</div>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </AuthenticatedLayout>
  );
}
