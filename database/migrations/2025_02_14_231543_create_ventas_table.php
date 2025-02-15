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
    Schema::create('ventas', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('cliente_id')->nullable();
        $table->decimal('total', 8, 2)->default(0);
        $table->softDeletes();
        $table->timestamps();

        $table->foreign('cliente_id')->references('id')->on('clientes');
    });
}

public function down()
{
    Schema::dropIfExists('ventas');
}

};
