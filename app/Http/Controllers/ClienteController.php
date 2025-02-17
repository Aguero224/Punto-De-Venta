<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        // Cargamos todos los clientes + paginación
        // e incluimos 'user' para ver email (si lo quisieras listar)
        $clientes = Cliente::with('user')->paginate(10);

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'direccion' => 'nullable|string|max:255',
        'telefono' => 'nullable|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|confirmed|min:8',
    ]);

    // 1) Crear user con rol=cliente
    $user = User::create([
        'name' => $request->nombre,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'cliente',
    ]);

    // 2) Crear registro en "clientes"
    $cliente = Cliente::create([
        'user_id' => $user->id,
        'nombre' => $request->nombre,
        'direccion' => $request->direccion,
        'telefono' => $request->telefono,
    ]);

    return redirect()->route('clientes.index')->with('success', 'Cliente creado con éxito');
}


    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);
        $user = $cliente->user; // Relación belongsTo con 'users'

        // Reglas base
        $rules = [
            'nombre' => 'required|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:255',
            // email debe ser único excepto para el user actual
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ];

        // Solo exigimos password si el admin desea cambiarla
        if ($request->filled('password')) {
            $rules['password'] = 'confirmed|min:8';
        }

        $data = $request->validate($rules);

        // 1) Actualizar user
        $user->name = $data['nombre'];
        $user->email = $data['email'];

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        // 2) Actualizar cliente
        $cliente->update([
            'nombre' => $data['nombre'],
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
        ]);

        return redirect()->route('clientes.index')->with('success', 'Cliente actualizado con éxito');
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        if ($cliente->user) {
            $cliente->user->delete();
        }
        $cliente->delete();

        return redirect()->route('clientes.index')->with('success', 'Cliente eliminado con éxito');
    }

    public function show($id)
{
    $cliente = Cliente::with([
        'ventas.detalles.producto'
    ])->findOrFail($id);

    return Inertia::render('Clientes/Show', [
        'cliente' => $cliente
    ]);
}

public function historial($id)
{
    $cliente = Cliente::with('ventas.detalles.producto')->findOrFail($id);
    return response()->json($cliente->ventas);
}


}
