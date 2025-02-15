import React, { useState } from 'react';
import { Head, Inertia, usePage } from '@inertiajs/react';

export default function Create() {
    const { clientes, productos } = usePage().props;

    const [form, setForm] = useState({
        cliente_id: '',
        productos: [],
    });

    const [temp, setTemp] = useState({
        id: '',
        cantidad: 1,
    });

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTempChange = (e) => {
        setTemp({ ...temp, [e.target.name]: e.target.value });
    };

    const addProducto = () => {
        if (!temp.id) return;
        const existe = form.productos.find((p) => p.id === temp.id);
        if (existe) {
            // Sumar cantidad
            const nuevos = form.productos.map((p) => {
                if (p.id === temp.id) {
                    return {
                        ...p,
                        cantidad: parseInt(p.cantidad) + parseInt(temp.cantidad),
                    };
                }
                return p;
            });
            setForm({ ...form, productos: nuevos });
        } else {
            setForm({
                ...form,
                productos: [...form.productos, temp],
            });
        }
        // Reiniciar temp
        setTemp({ id: '', cantidad: 1 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/ventas', form);
    };

    return (
        <div className="p-6">
            <Head title="Crear Venta" />
            <h1 className="text-2xl font-bold mb-4">Crear Venta</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Cliente (opcional):</label><br />
                    <select
                        name="cliente_id"
                        value={form.cliente_id}
                        onChange={handleFormChange}
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

                <div className="mb-4 border p-4">
                    <h2 className="font-semibold mb-2">Agregar Productos</h2>
                    <select
                        name="id"
                        value={temp.id}
                        onChange={handleTempChange}
                        className="border px-2 py-1 mr-2"
                    >
                        <option value="">-- Selecciona Producto --</option>
                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="cantidad"
                        value={temp.cantidad}
                        onChange={handleTempChange}
                        className="border px-2 py-1 w-20 mr-2"
                    />
                    <button
                        type="button"
                        onClick={addProducto}
                        className="bg-green-500 text-white px-2 py-1"
                    >
                        Agregar
                    </button>

                    {/* Vista rápida de productos agregados */}
                    <ul className="mt-4 list-disc list-inside">
                        {form.productos.map((item, idx) => (
                            <li key={idx}>
                                ID: {item.id} - Cantidad: {item.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Finalizar Venta
                </button>
            </form>
        </div>
    );
}
