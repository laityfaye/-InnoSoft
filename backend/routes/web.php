<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SitemapController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'InnoSoft Creation API',
        'version' => '1.0.0',
    ]);
});

// Sitemap XML pour le SEO
Route::get('/sitemap.xml', [SitemapController::class, 'index']);

