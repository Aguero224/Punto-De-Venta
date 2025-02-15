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
    Schema::create('lista_de_deseos', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('cliente_id');
        $table->unsignedBigInteger('producto_id');
        $table->integer('cantidad')->default(1);
        $table->softDeletes();
        $table->timestamps();

        $table->foreign('cliente_id')->references('id')->on('clientes');
        $table->foreign('producto_id')->references('id')->on('productos');
    });
}

public function down()
{
    Schema::dropIfExists('lista_de_deseos');
}

};
