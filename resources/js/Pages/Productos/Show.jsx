import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show() {
    const { producto } = usePage().props;

    return (
        <div className="p-6">
            <Head title="Detalle Producto" />
            <h1 className="text-2xl font-bold mb-4">Detalle del Producto</h1>

            <p><strong>ID:</strong> {producto.id}</p>
            <p><strong>Nombre:</strong> {producto.nombre}</p>
            <p><strong>Cantidad:</strong> {producto.cantidad}</p>
            <p><strong>Costo Adquisición:</strong> {producto.costo_adquisicion}</p>
            <p><strong>Precio Venta:</strong> {producto.precio_venta}</p>
            <p><strong>Proveedor:</strong> {producto.proveedor ? producto.proveedor.nombre : 'Sin Proveedor'}</p>

            <Link
                href="/productos"
                className="bg-gray-400 text-white px-4 py-2 mt-4 inline-block"
            >
                Volver
            </Link>
        </div>
    );
}
