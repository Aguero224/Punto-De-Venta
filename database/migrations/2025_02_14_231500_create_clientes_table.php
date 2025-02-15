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
    Schema::create('clientes', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->nullable();
        $table->string('nombre');
        $table->string('direccion')->nullable();
        $table->string('telefono')->nullable();
        $table->softDeletes(); 
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users');
    });
}


public function down()
{
    Schema::dropIfExists('clientes');
}

};
