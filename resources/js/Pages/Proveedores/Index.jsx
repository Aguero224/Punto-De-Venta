import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, proveedores }) {
    const { errors } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        id: null,
        nombre: '',
        direccion: '',
        telefono: '',
    });

    function openCreate() {
        setForm({ id: null, nombre: '', direccion: '', telefono: '' });
        setShowModal(true);
    }

    function openEdit(prov) {
        setForm({
            id: prov.id,
            nombre: prov.nombre,
            direccion: prov.direccion,
            telefono: prov.telefono,
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (form.id) {
          Inertia.put(`/proveedores/${form.id}`, form, {
            onSuccess: () => {
              setShowModal(false);
              window.location.href = '/proveedores';
            },
            onError: () => {},
          });
        } else {
          Inertia.post('/proveedores', form, {
            onSuccess: () => {
              setShowModal(false);
              window.location.href = '/proveedores';
            },
            onError: () => {},
          });
        }
      }
      
      
      

    const dataList = proveedores?.data ?? [];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Proveedores</h2>}
        >
            <Head title="Proveedores" />

            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={openCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Crear Proveedor
                    </button>
                </div>

                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Dirección</th>
                            <th className="border px-4 py-2">Teléfono</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((prov) => (
                            <tr key={prov.id}>
                                <td className="border px-4 py-2">{prov.id}</td>
                                <td className="border px-4 py-2">{prov.nombre}</td>
                                <td className="border px-4 py-2">{prov.direccion}</td>
                                <td className="border px-4 py-2">{prov.telefono}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => openEdit(prov)}
                                        className="text-green-500 mr-2"
                                    >
                                        Editar
                                    </button>
                                    <Link
                                        as="button"
                                        method="delete"
                                        href={`/proveedores/${prov.id}`}
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
                title={form.id ? 'Editar Proveedor' : 'Crear Proveedor'}
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
                        {errors.nombre && (
                            <div className="text-red-600 text-sm">{errors.nombre}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Dirección</label>
                        <input
                            type="text"
                            className="border w-full"
                            value={form.direccion}
                            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                        />
                        {errors.direccion && (
                            <div className="text-red-600 text-sm">{errors.direccion}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Teléfono</label>
                        <input
                            type="text"
                            className="border w-full"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        />
                        {errors.telefono && (
                            <div className="text-red-600 text-sm">{errors.telefono}</div>
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
