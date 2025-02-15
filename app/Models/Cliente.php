<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'user_id',
        'nombre',
        'direccion',
        'telefono',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ventas()
{
    return $this->hasMany(Venta::class, 'cliente_id');
}

}
