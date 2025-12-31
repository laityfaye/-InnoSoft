<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use App\ContactMessage;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Ajouter un sujet par défaut si non fourni
        $data = $request->all();
        if (!isset($data['subject']) || empty($data['subject'])) {
            $data['subject'] = 'Nouveau message depuis le formulaire de contact';
        }

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Sauvegarder le message dans la base de données
            $contactMessage = ContactMessage::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'subject' => $data['subject'],
                'message' => $data['message'],
            ]);

            // Queue email notification (asynchronous)
            // Envoyer à l'email admin configuré (ou fallback vers MAIL_FROM_ADDRESS)
            $adminEmail = config('mail.admin.address', config('mail.from.address'));
            
            // Si la queue échoue, on essaie d'envoyer de manière synchrone
            try {
                Mail::to($adminEmail)->queue(
                    new ContactFormMail($data)
                );
            } catch (\Exception $queueException) {
                // Si la queue échoue, fallback vers l'envoi synchrone
                \Log::warning('Erreur lors de la mise en queue de l\'email, envoi synchrone: ' . $queueException->getMessage());
                Mail::to($adminEmail)->send(
                    new ContactFormMail($data)
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            ], 200);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur lors de l\'envoi d\'email: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi du message.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

