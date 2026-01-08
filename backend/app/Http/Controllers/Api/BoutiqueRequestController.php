<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\BoutiqueRequest;
use App\Boutique;
use App\User;
use App\Mail\BoutiqueCredentialsMail;
use App\Mail\BoutiqueRequestNotificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class BoutiqueRequestController extends Controller
{
    /**
     * Créer une demande d'ouverture de boutique (public).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'boutique_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $boutiqueRequest = BoutiqueRequest::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'boutique_name' => $request->boutique_name,
                'description' => $request->description,
                'status' => 'pending',
            ]);

            // Envoyer une notification à l'administrateur
            try {
                $adminEmail = config('mail.admin.address', config('mail.from.address'));
                Mail::to($adminEmail)->queue(
                    new BoutiqueRequestNotificationMail($boutiqueRequest)
                );
            } catch (\Exception $mailException) {
                Log::warning('Erreur lors de l\'envoi de l\'email de notification admin, envoi synchrone: ' . $mailException->getMessage());
                try {
                    $adminEmail = config('mail.admin.address', config('mail.from.address'));
                    Mail::to($adminEmail)->send(
                        new BoutiqueRequestNotificationMail($boutiqueRequest)
                    );
                } catch (\Exception $syncMailException) {
                    Log::error('Erreur lors de l\'envoi synchrone de l\'email de notification admin: ' . $syncMailException->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Votre demande a été soumise avec succès. Nous vous contacterons sous peu.',
                'data' => $boutiqueRequest,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la demande de boutique: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la soumission de votre demande.',
            ], 500);
        }
    }

    /**
     * Liste toutes les demandes (admin only).
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        $query = BoutiqueRequest::with('processedBy')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $requests = $query->get();

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Afficher une demande spécifique (admin only).
     */
    public function show($id)
    {
        $request = BoutiqueRequest::with('processedBy')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $request,
        ]);
    }

    /**
     * Approuver une demande et créer la boutique (admin only).
     */
    public function approve(Request $request, $id)
    {
        $boutiqueRequest = BoutiqueRequest::findOrFail($id);

        if ($boutiqueRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cette demande a déjà été traitée.',
            ], 400);
        }

        try {
            // Générer un mot de passe temporaire
            $tempPassword = Str::random(12);
            $tempPasswordHash = Hash::make($tempPassword);

            // Créer ou récupérer l'utilisateur
            $user = User::firstOrCreate(
                ['email' => $boutiqueRequest->email],
                [
                    'name' => $boutiqueRequest->name,
                    'password' => $tempPasswordHash,
                    'is_admin' => false,
                ]
            );

            // Mettre à jour le mot de passe si l'utilisateur existe déjà
            if ($user->wasRecentlyCreated === false) {
                $user->update(['password' => $tempPasswordHash]);
            }

            // Créer la boutique
            $boutique = Boutique::create([
                'name' => $boutiqueRequest->boutique_name,
                'slug' => Boutique::generateSlug($boutiqueRequest->boutique_name),
                'description' => $boutiqueRequest->description,
                'owner_id' => $user->id,
                'email' => $boutiqueRequest->email,
                'phone' => $boutiqueRequest->phone,
                'status' => 'active',
                'temp_password' => $tempPasswordHash,
                'temp_password_expires_at' => now()->addDays(7), // Expire dans 7 jours
                'password_changed' => false,
            ]);

            // Mettre à jour la demande
            $boutiqueRequest->update([
                'status' => 'approved',
                'processed_at' => now(),
                'processed_by' => auth()->id(),
            ]);

            // Envoyer l'email avec les identifiants temporaires
            try {
                Mail::to($boutiqueRequest->email)->queue(
                    new BoutiqueCredentialsMail($boutique, $tempPassword)
                );
            } catch (\Exception $mailException) {
                Log::warning('Erreur lors de l\'envoi de l\'email, envoi synchrone: ' . $mailException->getMessage());
                Mail::to($boutiqueRequest->email)->send(
                    new BoutiqueCredentialsMail($boutique, $tempPassword)
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'La demande a été approuvée et la boutique a été créée. Les identifiants ont été envoyés par email.',
                'data' => [
                    'request' => $boutiqueRequest,
                    'boutique' => $boutique,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'approbation de la demande: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'approbation de la demande.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Rejeter une demande (admin only).
     */
    public function reject(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $boutiqueRequest = BoutiqueRequest::findOrFail($id);

        if ($boutiqueRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cette demande a déjà été traitée.',
            ], 400);
        }

        $boutiqueRequest->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
            'processed_at' => now(),
            'processed_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'La demande a été rejetée.',
            'data' => $boutiqueRequest,
        ]);
    }

    /**
     * Supprimer une demande (admin only).
     */
    public function destroy($id)
    {
        $boutiqueRequest = BoutiqueRequest::findOrFail($id);
        $boutiqueRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'La demande a été supprimée.',
        ]);
    }
}
