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
use App\Http\Controllers\Api\ContributionController;
use App\Http\Controllers\Api\ThankYouVideoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Guest and Public Routes
Route::post('/registry-items/{item}/contribute', [ContributionController::class, 'store']);
Route::post('/contributions/{contribution}/verify', [ContributionController::class, 'verify']);
Route::get('/contributions/{contribution}/thank-you', [ThankYouVideoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::apiResource('events', EventController::class);

    // Registry Items
    Route::get('/events/{event}/items', [RegistryItemController::class, 'index']);
    Route::post('/events/{event}/items', [RegistryItemController::class, 'store']);
    Route::put('/registry-items/{item}', [RegistryItemController::class, 'update']);
    Route::delete('/registry-items/{item}', [RegistryItemController::class, 'destroy']);

    // Host specific actions
    Route::post('/contributions/{contribution}/thank-you', [ThankYouVideoController::class, 'store']);
});
