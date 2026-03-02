<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\RegistryItemController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::apiResource('events', EventController::class);

    // Registry Items
    Route::get('/events/{event}/items', [RegistryItemController::class, 'index']);
    Route::post('/events/{event}/items', [RegistryItemController::class, 'store']);
    Route::put('/registry-items/{item}', [RegistryItemController::class, 'update']);
    Route::delete('/registry-items/{item}', [RegistryItemController::class, 'destroy']);
});
