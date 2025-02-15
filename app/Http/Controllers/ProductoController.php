<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Muestra la lista de productos (index).
     */
    public function index()
{
    $productos = Producto::with('proveedor')->paginate(10);
    $proveedores = Proveedor::all(); // para el select en el modal

    return Inertia::render('Productos/Index', [
        'productos' => $productos,
        'proveedores' => $proveedores,
    ]);
}


    /**
     * Muestra formulario para crear nuevo producto.
     */
    public function create()
    {
        // Cargamos proveedores para el <select>.
        $proveedores = Proveedor::all();

        return Inertia::render('Productos/Create', [
            'proveedores' => $proveedores
        ]);
    }

    /**
     * Guarda un nuevo producto en la DB.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:0',
            'costo_adquisicion' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'proveedor_id' => 'nullable|exists:proveedores,id',
        ]);

        Producto::create([
            'nombre' => $request->nombre,
            'cantidad' => $request->cantidad,
            'costo_adquisicion' => $request->costo_adquisicion,
            'precio_venta' => $request->precio_venta,
            'proveedor_id' => $request->proveedor_id,
        ]);

        return redirect()->route('productos.index')->with('success', 'Producto creado con éxito');
    }

    /**
     * Muestra el detalle de un producto en particular.
     */
    public function show($id)
    {
        $producto = Producto::with('proveedor')->findOrFail($id);

        return Inertia::render('Productos/Show', [
            'producto' => $producto
        ]);
    }

    /**
     * Muestra formulario para editar un producto existente.
     */
    public function edit($id)
    {
        $producto = Producto::findOrFail($id);
        $proveedores = Proveedor::all(); // para el <select>

        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'proveedores' => $proveedores
        ]);
    }

    /**
     * Actualiza producto en la DB.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cantidad' => 'required|integer|min:0',
            'costo_adquisicion' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'proveedor_id' => 'nullable|exists:proveedores,id',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update([
            'nombre' => $request->nombre,
            'cantidad' => $request->cantidad,
            'costo_adquisicion' => $request->costo_adquisicion,
            'precio_venta' => $request->precio_venta,
            'proveedor_id' => $request->proveedor_id,
        ]);

        return redirect()->route('productos.index')->with('success', 'Producto actualizado con éxito');
    }

    /**
     * Soft-delete de producto.
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado con éxito (SoftDelete)');
    }
}
