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
        try {
            // Récupérer l'URL du frontend depuis la configuration
            // Utilise FRONTEND_URL si disponible, sinon APP_URL, sinon valeur par défaut
            $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
            
            // S'assurer que l'URL ne se termine pas par un slash
            $frontendUrl = rtrim($frontendUrl, '/');
            
            // Vérifier si Imagick est disponible pour PNG, sinon utiliser SVG
            $format = extension_loaded('imagick') ? 'png' : 'svg';
            
            if ($format === 'png') {
                // Générer le QR code en PNG (nécessite Imagick)
                $qrCode = QrCode::format('png')
                    ->size(500)
                    ->errorCorrection('H')
                    ->generate($frontendUrl);
                
                return response($qrCode, 200)
                    ->header('Content-Type', 'image/png')
                    ->header('Content-Disposition', 'inline; filename="qrcode-innosoft.png"');
            } else {
                // Générer le QR code en SVG (fonctionne toujours)
                $qrCode = QrCode::format('svg')
                    ->size(500)
                    ->errorCorrection('H')
                    ->generate($frontendUrl);
                
                return response($qrCode, 200)
                    ->header('Content-Type', 'image/svg+xml')
                    ->header('Content-Disposition', 'inline; filename="qrcode-innosoft.svg"');
            }
        } catch (\Exception $e) {
            \Log::error('QR Code Generation Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Erreur lors de la génération du QR code',
                'message' => config('app.debug') ? $e->getMessage() : 'Une erreur est survenue'
            ], 500);
        }
    }

    /**
     * Génère un QR code SVG (vectoriel, plus léger)
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generateSvg(Request $request)
    {
        try {
            $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
            $frontendUrl = rtrim($frontendUrl, '/');
            
            $qrCode = QrCode::format('svg')
                ->size(500)
                ->errorCorrection('H')
                ->generate($frontendUrl);
            
            return response($qrCode, 200)
                ->header('Content-Type', 'image/svg+xml')
                ->header('Content-Disposition', 'inline; filename="qrcode-innosoft.svg"');
        } catch (\Exception $e) {
            \Log::error('QR Code SVG Generation Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Erreur lors de la génération du QR code SVG',
                'message' => config('app.debug') ? $e->getMessage() : 'Une erreur est survenue'
            ], 500);
        }
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
     * Télécharge le QR code en PNG haute résolution
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function download(Request $request)
    {
        try {
            $frontendUrl = env('FRONTEND_URL', env('APP_URL', 'https://innosft.com'));
            $frontendUrl = rtrim($frontendUrl, '/');
            
            // Taille haute résolution pour l'impression (2000px)
            $highResolutionSize = 2000;
            
            // Vérifier si Imagick est disponible (requis pour PNG)
            if (!extension_loaded('imagick')) {
                return response()->json([
                    'error' => 'Extension Imagick requise pour PNG',
                    'message' => 'L\'extension PHP Imagick est nécessaire pour générer des QR codes PNG. Veuillez contacter l\'administrateur système pour l\'installer.',
                    'alternative' => 'Vous pouvez utiliser /api/qrcode/svg pour un format SVG (vectoriel, haute qualité)'
                ], 503);
            }
            
            // Générer le QR code en PNG haute résolution
            $qrCode = QrCode::format('png')
                ->size($highResolutionSize) // Haute résolution pour l'impression (2000x2000px)
                ->errorCorrection('H') // Niveau de correction d'erreur élevé
                ->generate($frontendUrl);
            
            return response($qrCode, 200)
                ->header('Content-Type', 'image/png')
                ->header('Content-Disposition', 'attachment; filename="qrcode-innosoft-campaign-hd.png"');
                
        } catch (\Exception $e) {
            \Log::error('QR Code Download Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Erreur lors du téléchargement du QR code PNG',
                'message' => config('app.debug') ? $e->getMessage() : 'Une erreur est survenue lors de la génération du QR code PNG'
            ], 500);
        }
    }
}

