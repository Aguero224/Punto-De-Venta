import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, lista, productos }) {
    // 'productos' viene del controlador. Asegúrate de que no sea undefined
    // Errores de validación
    const { errors } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        id: null,
        producto_id: '',
        cantidad: 1,
    });

    function openCreate() {
        setForm({ id: null, producto_id: '', cantidad: 1 });
        setShowModal(true);
    }

    function openEdit(item) {
        setForm({
            id: item.id,
            producto_id: item.producto_id,
            cantidad: item.cantidad,
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (form.id) {
            Inertia.put(`/lista-deseos/${form.id}`, form, {
                onSuccess: () => setShowModal(false),
                onError: () => {},
            });
        } else {
            Inertia.post('/lista-deseos', form, {
                onSuccess: () => setShowModal(false),
                onError: () => {},
            });
        }
    }

    // Evitar error "map undefined"
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
                                    {item.producto ? item.producto.nombre : 'N/A'}
                                </td>
                                <td className="border px-4 py-2">{item.cantidad}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="text-green-500 mr-2"
                                    >
                                        Editar
                                    </button>
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
                                <option key={p.id} value={p.id}>{p.nombre}</option>
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
