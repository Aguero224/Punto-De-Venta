import React, { useState } from 'react';
import { Head, Inertia, usePage } from '@inertiajs/react';

export default function Create() {
    const { productos } = usePage().props;

    const [form, setForm] = useState({
        producto_id: '',
        cantidad: 1,
    });

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/lista-deseos', form);
    };

    return (
        <div className="p-6">
            <Head title="Agregar a Lista de Deseos" />
            <h1 className="text-2xl font-bold mb-4">Agregar a Lista de Deseos</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Producto:</label><br />
                    <select
                        name="producto_id"
                        value={form.producto_id}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    >
                        <option value="">-- Seleccionar --</option>
                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label>Cantidad:</label><br />
                    <input
                        type="number"
                        name="cantidad"
                        value={form.cantidad}
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
