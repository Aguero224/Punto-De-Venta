import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show() {
    const { proveedor } = usePage().props;

    return (
        <div className="p-6">
            <Head title="Detalle Proveedor" />
            <h1 className="text-2xl font-bold mb-4">Detalle del Proveedor</h1>

            <p><strong>ID:</strong> {proveedor.id}</p>
            <p><strong>Nombre:</strong> {proveedor.nombre}</p>
            <p><strong>Dirección:</strong> {proveedor.direccion}</p>
            <p><strong>Teléfono:</strong> {proveedor.telefono}</p>

            <Link
                href="/proveedores"
                className="bg-gray-400 text-white px-4 py-2 mt-4 inline-block"
            >
                Volver
            </Link>
        </div>
    );
}
