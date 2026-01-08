<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\User;
use App\Boutique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class BoutiqueAuthController extends Controller
{
    /**
     * Login pour les propriétaires de boutique.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte trouvé avec cet email.',
            ], 401);
        }

        // Vérifier si l'utilisateur est propriétaire d'une boutique
        $boutique = Boutique::where('owner_id', $user->id)->first();

        if (!$boutique) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas propriétaire d\'une boutique.',
            ], 403);
        }

        // Vérifier d'abord le mot de passe temporaire (stocké dans la boutique)
        if ($boutique->temp_password && Hash::check($request->password, $boutique->temp_password)) {
            // Vérifier si le mot de passe temporaire est expiré
            if ($boutique->temp_password_expires_at && now()->gt($boutique->temp_password_expires_at)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Votre mot de passe temporaire a expiré. Veuillez contacter l\'administrateur.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie. Veuillez changer votre mot de passe.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'boutique' => $boutique,
                    'token' => $user->createToken('boutique-token')->plainTextToken,
                    'must_change_password' => true,
                ],
            ]);
        }

        // Vérifier le mot de passe permanent
        if (Hash::check($request->password, $user->password)) {
            $token = $user->createToken('boutique-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'boutique' => $boutique,
                    'token' => $token,
                    'must_change_password' => false,
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Mot de passe incorrect.',
        ], 401);
    }

    /**
     * Changer le mot de passe (première connexion ou changement volontaire).
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $boutique = Boutique::where('owner_id', $user->id)->firstOrFail();

        // Vérifier le mot de passe actuel (temporaire ou permanent)
        $isTempPassword = $boutique->temp_password && Hash::check($request->current_password, $boutique->temp_password);
        $isCurrentPassword = Hash::check($request->current_password, $user->password);

        if (!$isTempPassword && !$isCurrentPassword) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe actuel incorrect.',
            ], 401);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Supprimer le mot de passe temporaire et marquer comme changé
        $boutique->temp_password = null;
        $boutique->temp_password_expires_at = null;
        $boutique->password_changed = true;
        $boutique->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe changé avec succès.',
        ]);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $boutique = Boutique::with('products', 'orders')
            ->where('owner_id', $user->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'boutique' => $boutique,
            ],
        ]);
    }

    /**
     * Déconnexion.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ]);
    }
}
