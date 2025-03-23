<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SnippetController;


Route::group(["prefix" => "v0.1"], function(){

    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
    });

    Route::group(["middleware" => "jwt.auth"], function(){
        Route::get('/snippets/search', [SnippetController::class, 'search']);
        Route::apiResource('/snippets', SnippetController::class);
        Route::post('/snippets/favorite/{id}', [SnippetController::class, 'toggleFavorite']);

    });

});