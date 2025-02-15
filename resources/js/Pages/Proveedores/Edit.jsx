import React, { useState } from 'react';
import { Head, Inertia, usePage } from '@inertiajs/react';

export default function Edit() {
    const { proveedor } = usePage().props;

    const [form, setForm] = useState({
        nombre: proveedor.nombre || '',
        direccion: proveedor.direccion || '',
        telefono: proveedor.telefono || '',
    });

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/proveedores/${proveedor.id}`, form);
    };

    return (
        <div className="p-6">
            <Head title="Editar Proveedor" />
            <h1 className="text-2xl font-bold mb-4">Editar Proveedor</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Nombre:</label><br />
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label>Dirección:</label><br />
                    <input
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label>Teléfono:</label><br />
                    <input
                        type="text"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Actualizar
                </button>
            </form>
        </div>
    );
}
