<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    /**
     * Display a listing of approved testimonials (public).
     */
    public function index()
    {
        $testimonials = Testimonial::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $testimonials,
        ]);
    }

    /**
     * Store a newly created testimonial (public submission).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $testimonial = Testimonial::create([
            'name' => $request->name,
            'role' => $request->role,
            'content' => $request->content,
            'rating' => $request->rating,
            'is_approved' => false, // Admin must approve
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre témoignage a été soumis avec succès. Il sera publié après validation par l\'administrateur.',
            'data' => $testimonial,
        ], 201);
    }

    /**
     * Display all testimonials (admin only).
     */
    public function adminIndex()
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $testimonials,
        ]);
    }

    /**
     * Update the specified testimonial (admin only).
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'role' => 'nullable|string|max:255',
            'content' => 'sometimes|required|string|max:1000',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $testimonial->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Témoignage mis à jour avec succès',
            'data' => $testimonial,
        ]);
    }

    /**
     * Remove the specified testimonial (admin only).
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Témoignage supprimé avec succès',
        ]);
    }

    /**
     * Approve a testimonial (admin only).
     */
    public function approve($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['is_approved' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Témoignage approuvé avec succès',
            'data' => $testimonial,
        ]);
    }

    /**
     * Reject a testimonial (admin only).
     */
    public function reject($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['is_approved' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Témoignage rejeté',
            'data' => $testimonial,
        ]);
    }
}
