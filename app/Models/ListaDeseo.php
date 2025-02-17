<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class ListaDeseo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lista_de_deseos';

    protected $fillable = [
        'cliente_id',
        'producto_id',
        'cantidad',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id')->withTrashed();
    }
}
