import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { cliente } = usePage().props; 
    // cliente.ventas => array 
    //   cada venta tiene detalles => array
    //     cada detalle => { producto: { nombre, ... }, cantidad, subtotal }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalle del Cliente</h2>}
        >
            <Head title={`Cliente #${cliente.id}`} />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">
                    Cliente: {cliente.nombre}
                </h1>
                <p>Dirección: {cliente.direccion}</p>
                <p>Teléfono: {cliente.telefono}</p>

                <hr className="my-4" />

                <h2 className="text-xl font-semibold mb-2">
                    Productos que ha comprado:
                </h2>

                {cliente.ventas && cliente.ventas.length > 0 ? (
                    cliente.ventas.map((venta) => (
                        <div key={venta.id} className="border p-2 mb-2">
                            <p>Venta #{venta.id} - Total: {venta.total}</p>
                            <ul className="list-disc list-inside ml-4">
                                {venta.detalles?.map((det) => (
                                    <li key={det.id}>
                                        {det.producto
                                          ? det.producto.nombre
                                          : 'Producto N/A'} 
                                        {' '} (x{det.cantidad})
                                        - Subtotal: {det.subtotal}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Este cliente aún no ha comprado productos.</p>
                )}

                <Link
                    href="/clientes"
                    className="bg-gray-400 text-white px-4 py-2 mt-4 inline-block"
                >
                    Volver
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
