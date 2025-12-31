<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AwardController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\Admin\ContactMessageController;

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
    
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    
    // Testimonials - public routes
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    
    // Partners - public routes
    Route::get('/partners', [PartnerController::class, 'index']);
    Route::get('/partners/{id}', [PartnerController::class, 'show']);
    
    // News - public routes
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{id}', [NewsController::class, 'show']);
    
    // Team - public routes
    Route::get('/team', [TeamController::class, 'index']);
    Route::get('/team/{id}', [TeamController::class, 'show']);
    
    // Certifications - public routes
    Route::get('/certifications', [CertificationController::class, 'index']);
    Route::get('/certifications/{id}', [CertificationController::class, 'show']);
    
    // Awards - public routes
    Route::get('/awards', [AwardController::class, 'index']);
    Route::get('/awards/{id}', [AwardController::class, 'show']);
    
    // Videos - public routes
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/videos/featured', [VideoController::class, 'featured']);
    Route::get('/videos/{id}', [VideoController::class, 'show']);
    
    // Social Links - public routes
    Route::get('/social-links', [SocialLinkController::class, 'index']);
    Route::get('/social-links/{id}', [SocialLinkController::class, 'show']);
    
    // Contact form
    Route::post('/contact', [ContactController::class, 'store']);
    
    // Chat - public routes
    Route::post('/chat/anonymous/conversation', [ChatController::class, 'createOrGetAnonymousConversation']);
    Route::get('/chat/conversations/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
    
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
    
    // Products - admin routes
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    
    // Partners - admin routes
    Route::get('/admin/partners', [PartnerController::class, 'adminIndex']);
    Route::post('/admin/partners', [PartnerController::class, 'store']);
    Route::put('/admin/partners/{id}', [PartnerController::class, 'update']);
    Route::delete('/admin/partners/{id}', [PartnerController::class, 'destroy']);
    
    // News - admin routes
    Route::get('/admin/news', [NewsController::class, 'adminIndex']);
    Route::post('/admin/news', [NewsController::class, 'store']);
    Route::put('/admin/news/{id}', [NewsController::class, 'update']);
    Route::delete('/admin/news/{id}', [NewsController::class, 'destroy']);
    
    // Team - admin routes
    Route::get('/admin/team', [TeamController::class, 'adminIndex']);
    Route::post('/admin/team', [TeamController::class, 'store']);
    Route::put('/admin/team/{id}', [TeamController::class, 'update']);
    Route::delete('/admin/team/{id}', [TeamController::class, 'destroy']);
    
    // Certifications - admin routes
    Route::get('/admin/certifications', [CertificationController::class, 'adminIndex']);
    Route::post('/admin/certifications', [CertificationController::class, 'store']);
    Route::put('/admin/certifications/{id}', [CertificationController::class, 'update']);
    Route::delete('/admin/certifications/{id}', [CertificationController::class, 'destroy']);
    
    // Awards - admin routes
    Route::get('/admin/awards', [AwardController::class, 'adminIndex']);
    Route::post('/admin/awards', [AwardController::class, 'store']);
    Route::put('/admin/awards/{id}', [AwardController::class, 'update']);
    Route::delete('/admin/awards/{id}', [AwardController::class, 'destroy']);
    
    // Videos - admin routes
    Route::get('/admin/videos', [VideoController::class, 'adminIndex']);
    Route::post('/admin/videos', [VideoController::class, 'store']);
    Route::put('/admin/videos/{id}', [VideoController::class, 'update']);
    Route::delete('/admin/videos/{id}', [VideoController::class, 'destroy']);
    
    // Social Links - admin routes
    Route::get('/admin/social-links', [SocialLinkController::class, 'adminIndex']);
    Route::post('/admin/social-links', [SocialLinkController::class, 'store']);
    Route::put('/admin/social-links/{id}', [SocialLinkController::class, 'update']);
    Route::delete('/admin/social-links/{id}', [SocialLinkController::class, 'destroy']);
    
    // Chat - authenticated routes
    Route::post('/chat/authenticated/conversation', [ChatController::class, 'createOrGetAuthenticatedConversation']);
    
    // Chat - admin routes
    Route::get('/admin/chat/conversations', [ChatController::class, 'getAllConversations']);
    Route::get('/admin/chat/conversations/{id}', [ChatController::class, 'getConversation']);
    Route::post('/admin/chat/conversations/{id}/reply', [ChatController::class, 'replyToConversation']);
    Route::post('/admin/chat/conversations/{id}/mark-read', [ChatController::class, 'markAsRead']);
    
    // Contact Messages - admin routes
    Route::get('/admin/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/admin/contact-messages/{id}', [ContactMessageController::class, 'show']);
    Route::post('/admin/contact-messages/{id}/mark-read', [ContactMessageController::class, 'markAsRead']);
    Route::post('/admin/contact-messages/{id}/reply', [ContactMessageController::class, 'reply']);
    Route::delete('/admin/contact-messages/{id}', [ContactMessageController::class, 'destroy']);
});

