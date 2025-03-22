<?php

namespace App\Http\Controllers;

use Validator;

use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = Auth()->attempt($credentials)) {
            return response()->json([
                "success" => false,
                "error" => "Unauthorized"
            ], 401);
        }

        $user = auth()->user();

        return response()->json([
            "success" => true,
            "user" => $user,
            "access_token" => $token,
            "token_type" => "bearer",
            "expires_in" => auth()->factory()->getTTL() * 60
        ]);
    }

    function signup(SignupRequest $request){
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        
        $token = Auth()->login($user);

        return response()->json([
            "success" => true,
            "user" => $user,
            "access_token" => $token,
            "token_type" => "bearer",
            "expires_in" => auth()->factory()->getTTL() * 60
        ], 201);
    }

    public function logout()
    {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    function editProfile(Request $request){
        $validator = Validator::make($request->all(), [
            'full_name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . auth()->id(),
            'email' => 'nullable|string|email|max:255|unique:users,email,' . auth()->id(),
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $user = auth()->user();
        $user->update($request->only(['full_name', 'username', 'email']));

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }
}