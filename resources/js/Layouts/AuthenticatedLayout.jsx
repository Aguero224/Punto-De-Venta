import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user; // Extraemos el usuario y su rol

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo + Nombre */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* Menu principal (versión escritorio) */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                {/* Enlaces dinámicos: si es admin */}
                                {user.role === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('clientes.index')}
                                            active={route().current('clientes.*')}
                                        >
                                            Clientes
                                        </NavLink>
                                        <NavLink
                                            href={route('proveedores.index')}
                                            active={route().current('proveedores.*')}
                                        >
                                            Proveedores
                                        </NavLink>
                                        <NavLink
                                            href={route('productos.index')}
                                            active={route().current('productos.*')}
                                        >
                                            Productos
                                        </NavLink>
                                        <NavLink
                                            href={route('ventas.index')}
                                            active={route().current('ventas.*')}
                                        >
                                            Ventas
                                        </NavLink>
                                    </>
                                )}

                                {/* Enlaces dinámicos: si es cliente */}
                                {user.role === 'cliente' && (
                                    <NavLink
                                        href={route('lista-deseos.index')}
                                        active={route().current('lista-deseos.*')}
                                    >
                                        Lista de Deseos
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Dropdown de usuario (versión escritorio) */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-mr-0.5 ml-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/* Enlace a la edición de perfil */}
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Botón hamburguesa (versión móvil) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu responsive (versión móvil) */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    {/* Links principales */}
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {/* Enlaces dinámicos: si es admin */}
                        {user.role === 'admin' && (
                            <>
                                <ResponsiveNavLink href={route('clientes.index')}>
                                    Clientes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('proveedores.index')}>
                                    Proveedores
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('productos.index')}>
                                    Productos
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('ventas.index')}>
                                    Ventas
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Enlaces dinámicos: si es cliente */}
                        {user.role === 'cliente' && (
                            <ResponsiveNavLink href={route('lista-deseos.index')}>
                                Lista de Deseos
                            </ResponsiveNavLink>
                        )}
                    </div>

                    {/* Sección inferior: perfil, logout (versión móvil) */}
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header principal */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido */}
            <main>{children}</main>
        </div>
    );
}
