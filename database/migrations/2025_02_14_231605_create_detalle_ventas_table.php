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
    Schema::create('detalle_ventas', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('venta_id');
        $table->unsignedBigInteger('producto_id');
        $table->integer('cantidad')->default(1);
        $table->decimal('precio_unitario', 8, 2)->default(0);
        $table->decimal('subtotal', 8, 2)->default(0);
        $table->softDeletes();
        $table->timestamps();

        $table->foreign('venta_id')->references('id')->on('ventas');
        $table->foreign('producto_id')->references('id')->on('productos');
    });
}

public function down()
{
    Schema::dropIfExists('detalle_ventas');
}

};
