import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
  const { auth } = usePage().props;
  const user = auth.user;

  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo y nombre */}
            <div className="flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-10 w-auto fill-current text-indigo-600" />
              </Link>
            </div>

            {/* Menú principal para escritorio */}
            <div className="hidden sm:flex sm:space-x-8">
              <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
              </NavLink>

              {user.role === 'admin' && (
                <>
                  <NavLink href={route('clientes.index')} active={route().current('clientes.*')}>
                    Clientes
                  </NavLink>
                  <NavLink href={route('proveedores.index')} active={route().current('proveedores.*')}>
                    Proveedores
                  </NavLink>
                  <NavLink href={route('productos.index')} active={route().current('productos.*')}>
                    Productos
                  </NavLink>
                  <NavLink href={route('ventas.index')} active={route().current('ventas.*')}>
                    Ventas
                  </NavLink>
                </>
              )}

              {user.role === 'cliente' && (
                <NavLink href={route('lista-deseos.index')} active={route().current('lista-deseos.*')}>
                  Lista de Deseos
                </NavLink>
              )}
            </div>

            {/* Dropdown usuario (escritorio) */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Dropdown>
                <Dropdown.Trigger>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    {user.name}
                    <svg
                      className="ml-2 h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Link href={route('profile.edit')}>
                    Profile
                  </Dropdown.Link>
                  <Dropdown.Link href={route('logout')} method="post" as="button">
                    Log Out
                  </Dropdown.Link>
                </Dropdown.Content>
              </Dropdown>
            </div>

            {/* Botón menú hamburguesa (móvil) */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={showingNavigationDropdown ? 'hidden' : 'inline-flex'}
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

        {/* Menú responsive (móvil) */}
        {showingNavigationDropdown && (
          <div className="sm:hidden">
            <div className="space-y-1 border-t border-gray-200 bg-white py-2">
              <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
              </ResponsiveNavLink>

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

              {user.role === 'cliente' && (
                <ResponsiveNavLink href={route('lista-deseos.index')}>
                  Lista de Deseos
                </ResponsiveNavLink>
              )}
            </div>

            <div className="border-t border-gray-200 bg-white pt-4 pb-2">
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href={route('profile.edit')}>
                  Profile
                </ResponsiveNavLink>
                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                  Log Out
                </ResponsiveNavLink>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Header principal */}
      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      {/* Contenido principal */}
      <main className="py-6">{children}</main>
    </div>
  );
}
