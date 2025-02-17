<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ListaDeseoController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Página principal
Route::get('/', function () {
    return inertia('Welcome');
});

// Rutas de autenticación generadas por Breeze (login, register, etc.)
require __DIR__.'/auth.php';

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {

    // Rutas para editar perfil (para admin o cliente, cualquiera logueado)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Rutas para ADMINISTRADOR
    Route::middleware(['admin'])->group(function () {
        Route::resource('clientes', ClienteController::class);
        Route::resource('proveedores', ProveedorController::class);
        Route::resource('productos', ProductoController::class);
        Route::resource('ventas', VentaController::class);
        
        // Agregamos la ruta de historial para clientes
        Route::get('clientes/{id}/historial', [ClienteController::class, 'historial'])->name('clientes.historial');
    });

    // Rutas para CLIENTE
    Route::middleware(['cliente'])->group(function () {
        Route::resource('lista-deseos', ListaDeseoController::class);
    });

    // Ruta de dashboard
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});

