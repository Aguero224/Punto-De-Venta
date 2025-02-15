<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class ClienteMiddleware
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        if (Auth::user()->role !== 'cliente') {
            return redirect('/dashboard')->with('error', 'No tienes acceso de cliente.');
        }

        return $next($request);
    }
}
