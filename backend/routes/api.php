<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;

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

Route::middleware('api')->group(function () {
    // Public routes
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    
    // Testimonials - public routes
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    
    // Contact form
    Route::post('/contact', [ContactController::class, 'store']);
    
    // Auth routes
    Route::post('/admin/login', [AuthController::class, 'login']);
});

// Protected routes (admin panel)
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    
    // Testimonials - admin routes
    Route::get('/admin/testimonials', [TestimonialController::class, 'adminIndex']);
    Route::put('/admin/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/admin/testimonials/{id}', [TestimonialController::class, 'destroy']);
    Route::post('/admin/testimonials/{id}/approve', [TestimonialController::class, 'approve']);
    Route::post('/admin/testimonials/{id}/reject', [TestimonialController::class, 'reject']);
    
    // Projects - admin routes
    Route::post('/admin/projects', [ProjectController::class, 'store']);
    Route::put('/admin/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/admin/projects/{id}', [ProjectController::class, 'destroy']);
});

