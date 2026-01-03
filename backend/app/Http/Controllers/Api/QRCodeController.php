<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeController extends Controller
{
    /**
     * Génère un QR code qui redirige vers la plateforme
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generate(Request $request)
    {
        // Récupérer l'URL du frontend depuis la configuration
        // Utilise FRONTEND_URL si disponible, sinon APP_URL, sinon valeur par défaut
        $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
        
        // S'assurer que l'URL ne se termine pas par un slash
        $frontendUrl = rtrim($frontendUrl, '/');
        
        // Générer le QR code en PNG
        $qrCode = QrCode::format('png')
            ->size(500) // Taille du QR code (500x500 pixels)
            ->errorCorrection('H') // Niveau de correction d'erreur élevé
            ->generate($frontendUrl);
        
        // Retourner l'image avec les bons headers
        return response($qrCode, 200)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'inline; filename="qrcode-innosoft.png"');
    }

    /**
     * Génère un QR code SVG (vectoriel, plus léger)
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generateSvg(Request $request)
    {
        $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
        $frontendUrl = rtrim($frontendUrl, '/');
        
        $qrCode = QrCode::format('svg')
            ->size(500)
            ->errorCorrection('H')
            ->generate($frontendUrl);
        
        return response($qrCode, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Content-Disposition', 'inline; filename="qrcode-innosoft.svg"');
    }

    /**
     * Retourne les informations du QR code (URL, format, etc.)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function info(Request $request)
    {
        $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
        $frontendUrl = rtrim($frontendUrl, '/');
        
        $baseUrl = config('app.url');
        
        return response()->json([
            'url' => $frontendUrl,
            'qr_code_png' => $baseUrl . '/api/qrcode',
            'qr_code_svg' => $baseUrl . '/api/qrcode/svg',
            'download_png' => $baseUrl . '/api/qrcode/download',
        ]);
    }

    /**
     * Télécharge le QR code en PNG
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function download(Request $request)
    {
        $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
        $frontendUrl = rtrim($frontendUrl, '/');
        
        $qrCode = QrCode::format('png')
            ->size(500)
            ->errorCorrection('H')
            ->generate($frontendUrl);
        
        return response($qrCode, 200)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="qrcode-innosoft-campaign.png"');
    }
}

