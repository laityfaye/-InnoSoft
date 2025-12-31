<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Conversation;
use App\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    /**
     * Créer ou récupérer une conversation anonyme
     */
    public function createOrGetAnonymousConversation(Request $request)
    {
        $sessionId = $request->input('session_id');
        
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        $conversation = Conversation::firstOrCreate(
            [
                'session_id' => $sessionId,
                'type' => 'anonymous',
            ],
            [
                'status' => 'active',
                'name' => $request->input('name'),
                'email' => $request->input('email'),
            ]
        );

        // Mettre à jour les infos si fournies
        if ($request->has('name') || $request->has('email')) {
            $conversation->update([
                'name' => $request->input('name', $conversation->name),
                'email' => $request->input('email', $conversation->email),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'conversation' => $conversation->load('messages'),
                'session_id' => $sessionId,
            ],
        ]);
    }

    /**
     * Créer ou récupérer une conversation authentifiée
     */
    public function createOrGetAuthenticatedConversation(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        $conversation = Conversation::firstOrCreate(
            [
                'user_id' => $user->id,
                'type' => 'authenticated',
            ],
            [
                'status' => 'active',
                'name' => $user->name,
                'email' => $user->email,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'conversation' => $conversation->load('messages'),
            ],
        ]);
    }

    /**
     * Envoyer un message
     */
    public function sendMessage(Request $request, $conversationId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $conversation = Conversation::findOrFail($conversationId);
        $user = $request->user();

        // Vérifier que l'utilisateur a accès à cette conversation
        if ($conversation->type === 'authenticated' && (!$user || $conversation->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        // Pour le chat anonyme, vérifier le session_id
        if ($conversation->type === 'anonymous' && $conversation->session_id !== $request->input('session_id')) {
            return response()->json([
                'success' => false,
                'message' => 'Session invalide',
            ], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user ? $user->id : null,
            'sender_type' => $user ? 'admin' : 'visitor',
            'content' => $request->input('content'),
        ]);

        // Mettre à jour la date du dernier message
        $conversation->update([
            'last_message_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $message->load('user'),
        ], 201);
    }

    /**
     * Récupérer les messages d'une conversation
     */
    public function getMessages(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = $request->user();

        // Vérifier l'accès
        if ($conversation->type === 'authenticated' && (!$user || $conversation->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        if ($conversation->type === 'anonymous' && $conversation->session_id !== $request->input('session_id')) {
            return response()->json([
                'success' => false,
                'message' => 'Session invalide',
            ], 403);
        }

        $messages = $conversation->messages()->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Marquer les messages comme lus (admin)
     */
    public function markAsRead(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        
        // Seuls les admins peuvent marquer comme lu
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $conversation->messages()
            ->where('sender_type', 'visitor')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Messages marqués comme lus',
        ]);
    }

    /**
     * Récupérer toutes les conversations (admin)
     */
    public function getAllConversations(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $conversations = Conversation::with(['lastMessage', 'user'])
            ->orderBy('last_message_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($conversation) {
                // Ajouter le nombre de messages non lus
                $unreadCount = $conversation->messages()
                    ->where('sender_type', 'visitor')
                    ->where('is_read', false)
                    ->count();
                
                $conversation->unread_count = $unreadCount;
                return $conversation;
            });

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    /**
     * Récupérer une conversation spécifique (admin)
     */
    public function getConversation(Request $request, $conversationId)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $conversation = Conversation::with(['messages.user', 'user'])->findOrFail($conversationId);

        return response()->json([
            'success' => true,
            'data' => $conversation,
        ]);
    }

    /**
     * Répondre à une conversation (admin)
     */
    public function replyToConversation(Request $request, $conversationId)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $conversation = Conversation::findOrFail($conversationId);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $request->user()->id,
            'sender_type' => 'admin',
            'content' => $request->input('content'),
            'is_read' => false, // Le visiteur n'a pas encore lu
        ]);

        $conversation->update([
            'last_message_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $message->load('user'),
        ], 201);
    }
}

