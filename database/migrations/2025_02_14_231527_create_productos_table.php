<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('productos', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('proveedor_id')->nullable();
        $table->string('nombre');
        $table->integer('cantidad')->default(0);
        $table->decimal('costo_adquisicion', 8, 2)->default(0);
        $table->decimal('precio_venta', 8, 2)->default(0);
        $table->softDeletes();
        $table->timestamps();

        $table->foreign('proveedor_id')->references('id')->on('proveedores');
    });
}

public function down()
{
    Schema::dropIfExists('productos');
}

};
