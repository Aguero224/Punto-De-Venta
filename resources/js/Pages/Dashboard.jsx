import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            // Puedes pasar un header si quieres
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Bienvenido al Dashboard</h1>

                {auth.user.role === 'admin' && (
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="text-xl font-semibold">Sección Admin</h2>
                        <p>Accede a la gestión de Clientes, Proveedores, Productos y Ventas.</p>
                    </div>
                )}

                {auth.user.role === 'cliente' && (
                    <div className="bg-blue-100 p-4 rounded">
                        <h2 className="text-xl font-semibold">Sección Cliente</h2>
                        <p>Accede a tu Lista de Deseos y revisa los productos disponibles.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
