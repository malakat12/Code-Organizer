<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function login(Request $request){
        $credentials = [
            "email" => $request["email"], 
            "password"=> $request["password"]
        ];

        if (! $token = Auth::attempt($credentials)) {
            return response()->json([
                "success" => false,
                "error" => "Unauthorized"
            ], 401);
        }

        $user = Auth::user();
        $user->token = $token;

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }

    function signup(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        
        return response()->json([
            "success" => true
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    function editProfile(Request $request){
        $user = Auth::user();

        $user->full_name = $request["full_name"] ? $request["full_name"] : $user->full_name;
        $user->username = $request["username"] ? $request["username"] : $user->username;
        $user->email = $request["email"] ? $request["email"] : $user->email;
        
        $user->save();

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }
}