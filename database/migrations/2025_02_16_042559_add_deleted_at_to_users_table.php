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
    Schema::table('users', function (Blueprint $table) {
        $table->softDeletes(); // Agrega la columna 'deleted_at' para SoftDeletes
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropSoftDeletes(); // Elimina la columna 'deleted_at'
    });
}

};
