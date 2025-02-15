import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show() {
    const { venta } = usePage().props;

    return (
        <div className="p-6">
            <Head title={`Venta #${venta.id}`} />
            <h1 className="text-2xl font-bold mb-4">Detalle de la Venta #{venta.id}</h1>

            <p><strong>Cliente:</strong> {venta.cliente ? venta.cliente.nombre : 'Sin cliente'}</p>
            <p><strong>Total:</strong> {venta.total}</p>

            <h2 className="font-semibold mt-4">Productos:</h2>
            <ul className="list-disc list-inside">
                {venta.detalles.map((det) => (
                    <li key={det.id}>
                        Producto: {det.producto.nombre} - Cantidad: {det.cantidad} - Subtotal: {det.subtotal}
                    </li>
                ))}
            </ul>

            <Link
                href="/ventas"
                className="bg-gray-400 text-white px-4 py-2 mt-4 inline-block"
            >
                Volver
            </Link>
        </div>
    );
}
