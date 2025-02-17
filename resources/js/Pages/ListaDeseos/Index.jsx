import React, { useState } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, lista, productos }) {
  const { errors } = usePage().props;
  const [clientErrors, setClientErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario para agregar/editar un deseo
  const [form, setForm] = useState({
    id: null,
    producto_id: '',
    cantidad: '',
  });

  // Abre el modal para crear (o editar)
  const openCreate = () => {
    setForm({ id: null, producto_id: '', cantidad: '' });
    setClientErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    // Solo se permite editar si el producto aún existe y no está eliminado
    if (item.producto && !item.producto.deleted_at) {
      setForm({
        id: item.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
      });
      setClientErrors({});
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  // Validación y envío del formulario en el handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsLocal = {};

    if (!form.producto_id) {
      errorsLocal.producto_id = "El producto es obligatorio.";
    }
    if (!form.cantidad || isNaN(form.cantidad) || Number(form.cantidad) <= 0) {
      errorsLocal.cantidad = "La cantidad debe ser un número mayor a 0.";
    }

    if (Object.keys(errorsLocal).length > 0) {
      setClientErrors(errorsLocal);
      return;
    } else {
      setClientErrors({});
    }

    const onSuccess = (page) => {
      if (Object.keys(page.props.errors).length === 0) {
        setShowModal(false);
        router.visit('/lista-deseos');
      }
    };

    if (form.id) {
      router.put(`/lista-deseos/${form.id}`, form, { onSuccess, onError: () => {} });
    } else {
      router.post('/lista-deseos', form, { onSuccess, onError: () => {} });
    }
  };

  const dataList = lista?.data || [];

  // Extraemos los IDs de los productos ya en la lista (si el producto existe en el registro, se toma su id; en caso contrario, se usa la propiedad producto_id)
  const existingProductIds = dataList.map(item => (item.producto ? item.producto.id : item.producto_id));

  // Filtramos los productos para que en el select solo se muestren aquellos que aún no estén en la lista
  const availableProducts = productos.filter(p => !existingProductIds.includes(p.id));

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-2xl text-gray-800">Lista de Deseos</h2>}>
      <Head title="Lista de Deseos" />

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Agregar a Lista
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{item.id}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">
                    {item.producto ? (
                      <>
                        {item.producto.nombre}{' '}
                        {item.producto.deleted_at ? (
                          <span className="text-red-500 text-sm">(Este producto ya no está en la tienda.)</span>
                        ) : (
                          Number(item.producto.cantidad) >= Number(item.cantidad) ? (
                            <span className="text-green-500 text-sm">(En stock)</span>
                          ) : (
                            <span className="text-red-500 text-sm">(No hay stock de esa cantidad)</span>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        {item.producto_nombre ? item.producto_nombre : 'Producto eliminado'}{' '}
                        <span className="text-red-500 text-sm">(Este producto ya no está en la tienda.)</span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800">{item.cantidad}</td>
                  <td className="px-6 py-3 border-b text-center">
                    {item.producto && !item.producto.deleted_at && (
                      <button onClick={() => openEdit(item)} className="text-green-500 hover:underline mr-2">
                        Editar
                      </button>
                    )}
                    <Link as="button" method="delete" href={`/lista-deseos/${item.id}`} className="text-red-500 hover:underline">
                      Eliminar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {lista.links && Array.isArray(lista.links) && (
          <div className="mt-6 flex justify-center space-x-2">
            {lista.links.map((link, index) => (
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

      {/* Modal para Agregar/Editar Deseo */}
      <Modal title={form.id ? 'Editar Deseo' : 'Agregar Deseo'} isOpen={showModal} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Producto</label>
            <select
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.producto_id}
              onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
            >
              <option value="">-- Seleccionar --</option>
              {availableProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {(clientErrors.producto_id || errors.producto_id) && (
              <p className="mt-1 text-sm text-red-600">
                {clientErrors.producto_id || errors.producto_id}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Cantidad</label>
            <input
              type="number"
              min="1"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
            />
            {(clientErrors.cantidad || errors.cantidad) && (
              <p className="mt-1 text-sm text-red-600">
                {clientErrors.cantidad || errors.cantidad}
              </p>
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
