<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Snippet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SnippetController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $snippets = Snippet::with('tags')->where('user_id', Auth::id())->get();
        if ($snippets->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No snippets found',
                'snippets' => []
            ], 200);
        }
    
        return response()->json([
            'success' => true,
            'snippets' => $snippets
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string',
            'language' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
        ]);    

        $snippet = Snippet::create([
            'user_id' => Auth::id(), 
            'title' => $request->title,
            'code' => $request->code,
            'language' => $request->language,
        ]);

        if ($request->tags) {
            $tagIds = [];
            foreach ($request->tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $snippet->tags()->sync($tagIds);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Snippet created successfully.',
            'data' => [
                'snippet' => $snippet,
                'tags' => $snippet->tags,
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        echo "here!!";
        $snippet = Snippet::where('user_id', Auth::id())
        ->where('id', $id)
        ->first();         
        if (!$snippet) {
            return response()->json([
                "success" => false,
                "message" => "Snippet not found or does not belong to the authenticated user."
            ], 404);
        }
        return response()->json([
            "success" => "true",
            "snippet" => $snippet
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $id)
    {
        $snippet= Snippet::where('user_id',  Auth::id())->findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'code' => 'sometimes|string',
            'language' => 'sometimes|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_favorite'=>'sometimes|boolean',
        ]);  

        $snippet->update($request->except('tags'));

        if ($request->has('tags')) {
            $tagIds = [];
            foreach ($request->tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $snippet->tags()->sync($tagIds);
        }

        return response()->json([
            "success" => "true",
            "snipppet" => $snippet
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $snippet= Snippet::where('user_id',  Auth::id())->findOrFail($id);
        $snippet->delete();
        return response()->json([
            'success' => true,
            'message' => 'Snippet deleted successfully'
        ], 200);
    }

    public function toggleFavorite($id){
        $snippet= Snippet::where('user_id',  Auth::id())->findOrFail($id);
        $snippet->is_favorite = !$snippet->is_favorite;
        $snippet->save();
        return response()->json([
            'success' => true,
            'snippet' => $snippet
        ]);
    }

    public function search(Request $request)
    {

        $query = $request->query('q');        
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required'
            ], 400);
        }
        $userId = Auth::id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }
        
        $snippets = Snippet::where('user_id', Auth::id())
            ->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', "%$query%")
                  ->orWhere('language', 'LIKE', "%$query%")
                  ->orWhereHas('tags', function ($tagQuery) use ($query) {
                      $tagQuery->where('name', 'LIKE', "%$query%");
                  });
            })->with('tags')->get();

        return response()->json([
            'success' => true,
            'message' => $snippets->isEmpty() ? 'No snippets found' : 'Snippets retrieved successfully',
            'snippets' => $snippets
        ]);
    }
}
