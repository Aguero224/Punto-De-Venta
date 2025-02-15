import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ auth, clientes }) {
    // Recibimos la paginación de clientes con su user
    // por ejemplo: clientes.data => [{id, nombre, user: {id, email}, ...}, ...]
    const { errors } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        id: null,
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function openCreate() {
        // Limpiar el form
        setForm({
            id: null,
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        setShowModal(true);
    }

    function openEdit(cliente) {
        // Rellenamos con datos
        // cliente.user.email => para el email
        setForm({
            id: cliente.id,
            nombre: cliente.nombre,
            direccion: cliente.direccion || '',
            telefono: cliente.telefono || '',
            email: cliente.user ? cliente.user.email : '',
            password: '',
            password_confirmation: '',
        });
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (form.id) {
            // Update
            Inertia.put(`/clientes/${form.id}`, form, {
                onSuccess: () => setShowModal(false),
                onError: () => {},
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            // Create
            Inertia.post(`/clientes`, form, {
                onSuccess: () => setShowModal(false),
                onError: () => {},
                preserveState: true,
                preserveScroll: true,
            });
        }
    }

    // Para listar en la tabla
    const dataList = clientes?.data ?? [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Listado de Clientes
                </h2>
            }
        >
            <Head title="Clientes" />

            <div className="p-6">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={openCreate}
                    >
                        Crear Cliente
                    </button>
                </div>

                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Email (User)</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((cli) => (
                            <tr key={cli.id}>
                                <td className="border px-4 py-2">{cli.id}</td>
                                <td className="border px-4 py-2">{cli.nombre}</td>
                                <td className="border px-4 py-2">
                                    {/* Mostrar el email del user */}
                                    {cli.user ? cli.user.email : 'N/A'}
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => openEdit(cli)}
                                        className="text-green-500 mr-2"
                                    >
                                        Editar
                                    </button>
                                    <Link
                                        as="button"
                                        method="delete"
                                        href={`/clientes/${cli.id}`}
                                        className="text-red-500"
                                    >
                                        Eliminar
                                    </Link>

                                    <Link
      href={route('clientes.show', cli.id)}
      className="text-blue-500 mr-2"
    >
      Historial
    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={form.id ? 'Editar Cliente' : 'Crear Cliente'}
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

                    <hr className="my-3" />
                    <h3 className="font-semibold mb-2">Credenciales de usuario</h3>

                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            className="border w-full"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && (
                            <div className="text-red-600 text-sm">{errors.email}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            className="border w-full"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        {errors.password && (
                            <div className="text-red-600 text-sm">{errors.password}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="border w-full"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                        Guardar
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
