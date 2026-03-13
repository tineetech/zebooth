<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TiketController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/verify-ticket', [TiketController::class, 'verify']);

// printing endpoint used by admin panel (opens new window/tab)
Route::get('/ticket/{tiket}/print', [TiketController::class, 'print'])
    ->name('ticket.print');
