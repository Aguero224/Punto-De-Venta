<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;

class VentaController extends Controller
{
    public function index()
    {
        $ventas = Venta::with(['cliente', 'detalles.producto'])->paginate(10);
        // Enviamos la lista de clientes y productos
        $clientes = Cliente::all();
        $productos = Producto::where('cantidad', '>', 0)->get();

        return Inertia::render('Ventas/Index', [
            'ventas' => $ventas,
            'clientes' => $clientes,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        // cliente_id => required
        $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
            'productos'  => 'required|array',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);
        

        DB::transaction(function() use ($request) {
            $venta = Venta::create([
                'cliente_id' => $request->cliente_id,
                'total' => 0,
            ]);

            $total = 0;

            foreach($request->productos as $item) {
                $producto = Producto::findOrFail($item['id']);
                $cantidadVendida = $item['cantidad'];
            
                if ($producto->cantidad < $cantidadVendida) {
                    throw new \Exception("Stock insuficiente para {$producto->nombre}");
                }
            
                $producto->cantidad -= $cantidadVendida;
                $producto->save();
            
                $subtotal = $producto->precio_venta * $cantidadVendida;
                $total += $subtotal;
            
                DetalleVenta::create([
                    'venta_id'        => $venta->id,
                    'producto_id'     => $producto->id,
                    'producto_nombre' => $producto->nombre, 
                    'cantidad'        => $cantidadVendida,
                    'precio_unitario' => $producto->precio_venta,
                    'subtotal'        => $subtotal,
                ]);
                
            }

            $venta->update(['total' => $total]);
        });

        // Aquí debes redirigir con Inertia, no con `redirect()`
    return Inertia::render('Ventas/Index', [
        'ventas' => Venta::with(['cliente', 'detalles.producto'])->paginate(10),
        'clientes' => Cliente::all(),
        'productos' => Producto::where('cantidad', '>', 0)->get(),
    ]);
    }

    public function show($id)
    {
        $venta = Venta::with('cliente', 'detalles.producto')->findOrFail($id);
        return Inertia::render('Ventas/Show', [
            'venta' => $venta
        ]);
    }

    public function edit($id)
    {
        // Generalmente, una venta no se edita, pero si lo requieres:
        $venta = Venta::with('detalles.producto')->findOrFail($id);
        $clientes = Cliente::all();
        $productos = Producto::all();
        return Inertia::render('Ventas/Edit', [
            'venta' => $venta,
            'clientes' => $clientes,
            'productos' => $productos
        ]);
    }

    public function update(Request $request, $id)
    {
        // Depende de la lógica que manejes. Simplificamos:
        $request->validate([
            'cliente_id' => 'nullable|exists:clientes,id',
        ]);

        $venta = Venta::findOrFail($id);
        $venta->update([
            'cliente_id' => $request->cliente_id,
        ]);

        return redirect()->route('ventas.index')->with('success', 'Venta actualizada');
    }

    public function destroy($id)
    {
        $venta = Venta::findOrFail($id);
        $venta->delete();
        return redirect()->route('ventas.index')->with('success', 'Venta eliminada (SoftDelete)');
    }
}
