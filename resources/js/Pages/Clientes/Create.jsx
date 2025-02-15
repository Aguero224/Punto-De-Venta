import React, { useState } from 'react';
import { Head, Inertia } from '@inertiajs/react';

export default function Create() {
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/clientes', form);
    };

    return (
        <div className="p-6">
            <Head title="Crear Cliente" />
            <h1 className="text-2xl font-bold mb-4">Crear Cliente</h1>

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
                    Guardar
                </button>
            </form>
        </div>
    );
}
