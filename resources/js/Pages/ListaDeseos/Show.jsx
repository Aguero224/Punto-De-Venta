import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show() {
    const { lista } = usePage().props;

    return (
        <div className="p-6">
            <Head title="Detalle de Deseo" />
            <h1 className="text-2xl font-bold mb-4">Detalle de la Lista de Deseos</h1>

            <p><strong>ID:</strong> {lista.id}</p>
            <p><strong>Producto:</strong> {lista.producto ? lista.producto.nombre : 'N/A'}</p>
            <p><strong>Cantidad:</strong> {lista.cantidad}</p>

            <Link
                href="/lista-deseos"
                className="bg-gray-400 text-white px-4 py-2 mt-4 inline-block"
            >
                Volver
            </Link>
        </div>
    );
}
