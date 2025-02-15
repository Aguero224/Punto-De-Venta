import React, { useState } from 'react';
import { Head, Inertia, usePage } from '@inertiajs/react';

export default function Edit() {
    const { producto, proveedores } = usePage().props;

    const [form, setForm] = useState({
        nombre: producto.nombre || '',
        cantidad: producto.cantidad || 0,
        costo_adquisicion: producto.costo_adquisicion || 0,
        precio_venta: producto.precio_venta || 0,
        proveedor_id: producto.proveedor_id || '',
    });

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/productos/${producto.id}`, form);
    };

    return (
        <div className="p-6">
            <Head title="Editar Producto" />
            <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>

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
                    <label>Cantidad:</label><br />
                    <input
                        type="number"
                        name="cantidad"
                        value={form.cantidad}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label>Costo de Adquisición:</label><br />
                    <input
                        type="number"
                        step="0.01"
                        name="costo_adquisicion"
                        value={form.costo_adquisicion}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label>Precio de Venta:</label><br />
                    <input
                        type="number"
                        step="0.01"
                        name="precio_venta"
                        value={form.precio_venta}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label>Proveedor:</label><br />
                    <select
                        name="proveedor_id"
                        value={form.proveedor_id}
                        onChange={handleChange}
                        className="border px-2 py-1"
                    >
                        <option value="">-- Selecciona --</option>
                        {proveedores.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                                {prov.nombre}
                            </option>
                        ))}
                    </select>
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
