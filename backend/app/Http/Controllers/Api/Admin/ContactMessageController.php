<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReplyMail;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages (admin only).
     */
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Display the specified contact message (admin only).
     */
    public function show($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        // Marquer comme lu si ce n'est pas déjà fait
        if (!$message->is_read) {
            $message->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    /**
     * Mark message as read (admin only).
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu',
            'data' => $message,
        ]);
    }

    /**
     * Reply to a contact message (admin only).
     */
    public function reply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reply_message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $replyMessage = $request->input('reply_message');

        try {
            // Envoyer l'email de réponse
            $adminEmail = config('mail.admin.address', config('mail.from.address'));
            
            try {
                Mail::to($message->email)->queue(
                    new ContactReplyMail([
                        'name' => $message->name,
                        'subject' => $message->subject ?? 'Réponse à votre message',
                        'reply_message' => $replyMessage,
                        'original_message' => $message->message,
                    ])
                );
            } catch (\Exception $queueException) {
                \Log::warning('Erreur lors de la mise en queue de la réponse, envoi synchrone: ' . $queueException->getMessage());
                Mail::to($message->email)->send(
                    new ContactReplyMail([
                        'name' => $message->name,
                        'subject' => $message->subject ?? 'Réponse à votre message',
                        'reply_message' => $replyMessage,
                        'original_message' => $message->message,
                    ])
                );
            }

            // Mettre à jour le message
            $message->update([
                'is_replied' => true,
                'replied_at' => now(),
                'admin_reply' => $replyMessage,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réponse envoyée avec succès',
                'data' => $message,
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi de la réponse: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi de la réponse.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete a contact message (admin only).
     */
    public function destroy($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé',
            ], 404);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé avec succès',
        ]);
    }
}
