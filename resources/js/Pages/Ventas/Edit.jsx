import React, { useState } from 'react';
import { Head, Inertia, usePage } from '@inertiajs/react';

export default function Edit() {
    const { venta, clientes, productos } = usePage().props;

    const [form, setForm] = useState({
        cliente_id: venta.cliente_id || '',
        // Podrías también manejar los productos del detalle
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/ventas/${venta.id}`, form);
    };

    return (
        <div className="p-6">
            <Head title="Editar Venta" />
            <h1 className="text-2xl font-bold mb-4">Editar Venta</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Cliente (opcional):</label><br />
                    <select
                        name="cliente_id"
                        value={form.cliente_id}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    >
                        <option value="">-- Sin cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Opcional: Manejar edición de productos */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Actualizar Venta
                </button>
            </form>
        </div>
    );
}
