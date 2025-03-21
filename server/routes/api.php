<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SnippetController;


Route::group(["prefix" => "v0.1"], function(){

    Route::group(["middleware" => "auth:api"], function(){
        Route::apiResource('/snippets', SnippetController::class);
        
        Route::post('/snippets/favorite/{id}', [SnippetController::class, 'toggleFavorite']);
        Route::get('/snippets/search/{query}', [SnippetController::class, 'search']);

    });
    
    Route::post('/login', [AuthController::class, "login"]);
    Route::post('/signup', [AuthController::class, "signup"]);
});


