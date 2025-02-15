<?php

namespace App\Http\Controllers;

use App\Models\ListaDeseo;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ListaDeseoController extends Controller
{
    public function index()
    {
        // Obtenemos el "cliente" actual
        $cliente = Auth::user()->cliente;
        if (!$cliente) {
            // Manejo de error: redirigir con mensaje
            return redirect()->route('dashboard')->with('error', 'No tienes un perfil de cliente asociado.');
        }

        $lista = ListaDeseo::with('producto')
            ->where('cliente_id', $cliente->id)
            ->paginate(10);

        // Pasamos productos si deseas un select de productos en Index
        $productos = Producto::all();

        return Inertia::render('ListaDeseos/Index', [
            'lista' => $lista,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        // Verifica que el user->cliente no sea null
        $cliente = Auth::user()->cliente;
        if (!$cliente) {
            return back()->withErrors(['cliente' => 'No se encontró el cliente asociado a tu cuenta.'])->withInput();
        }

        ListaDeseo::create([
            'cliente_id' => $cliente->id,
            'producto_id' => $request->producto_id,
            'cantidad' => $request->cantidad,
        ]);

        return redirect()->route('lista-deseos.index')->with('success', 'Producto agregado a la lista de deseos');
    }

    public function show($id)
    {
        $lista = ListaDeseo::with('producto')->findOrFail($id);
        return Inertia::render('ListaDeseos/Show', [
            'lista' => $lista
        ]);
    }

    public function edit($id)
    {
        $lista = ListaDeseo::findOrFail($id);
        $productos = Producto::all();
        return Inertia::render('ListaDeseos/Edit', [
            'lista' => $lista,
            'productos' => $productos
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        $lista = ListaDeseo::findOrFail($id);
        $lista->update([
            'producto_id' => $request->producto_id,
            'cantidad' => $request->cantidad,
        ]);

        return redirect()->route('lista-deseos.index')->with('success', 'Lista de deseos actualizada');
    }

    public function destroy($id)
    {
        $lista = ListaDeseo::findOrFail($id);
        $lista->delete();
        return redirect()->route('lista-deseos.index')->with('success', 'Elemento de la lista de deseos eliminado (SoftDelete)');
    }
}
