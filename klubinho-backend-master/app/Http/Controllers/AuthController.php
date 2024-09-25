<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ClubIntegrantes;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        $user = new User;
        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->phone_number = $request->phone_number;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'user' => $user,
            "message" => "User record created"
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = User::where('email', $credentials['email'])->first();

        // Busca o club_id associado ao usuário na tabela club_integrantes
        $clubId = ClubIntegrantes::where('user_id', $user->id)->value('club_id');
        $role = ClubIntegrantes::where('user_id', $user->id)->value('role');

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'club_id' => $clubId,
            'token' => $token,
            'role' => $role
        ], 200);
    }


    public function getUser($id)
    {
        if (User::where('id', $id)->exists()) {
            // $user = User::where('id', $id)->get()->toJson(JSON_PRETTY_PRINT);
            // join in table club_integrantes to get club_id and join in table club to get club name
            $user = User::where('users.id', $id)
            ->join('club_integrantes', 'users.id', '=', 'club_integrantes.user_id')
            ->join('clubs', 'club_integrantes.club_id', '=', 'clubs.id')
            ->select('users.*', 'clubs.name as club_name', 'clubs.nick_club')
            ->get()->toJson(JSON_PRETTY_PRINT);
            return response($user, 200);
        } else {
            return response()->json([
                "message" => "User not found"
            ], 404);
        }
    }

    public function logout()
    {
        Auth::user()->tokens->each(function ($token, $key) {
            $token->delete();
        });
    
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function getAccessToken(Request $request)
    {
        $token = $request->user()->createToken($request->token_name);
        return response()->json(['token' => $token->plainTextToken]);
    }

    //get user id by token
    public function getUserIdByToken(Request $request)
    {
        $user = $request->user();
        return response()->json(['user_id' => $user->id]);
    }

    // update user data
    public function updateUserData(Request $request)
    {
        $user = User::find($request->id);
        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->phone_number = $request->phone_number;
        $user->birthday_date = $request->birthday_date;
        $user->email = $request->email;
        $user->bio = $request->bio;
        $user->save();
        return response()->json([
            "message" => "User data updated"
        ], 201);
    }

    // get all name and last_name by club_id
    public function getAllNameByClub($club_id)
    {
        if (ClubIntegrantes::where('club_id', $club_id)->exists()) {
            // pela tabela de club integrantes, pega todos os usuários que tem o club_id e retornar o nome e sobrenome
            $user = ClubIntegrantes::where('club_id', $club_id)
            ->join('users', 'club_integrantes.user_id', '=', 'users.id')
            ->select('users.name', 'users.last_name')
            ->get()->toJson(JSON_PRETTY_PRINT);
            return response($user, 200);
        } else {
            return response()->json([
                "message" => "User not found"
            ], 404);
        }
    }

    public function uploadImagem(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "message" => "User not found"
            ], 404);
        }

        if ($request->hasFile('imagem') && $request->file('imagem')->isValid()) {
            $imagem = $request->file('imagem');
            
            // Adicione esta linha para imprimir as informações do arquivo
            error_log(print_r($imagem, true));

            $path = $imagem->store('imagens/profile_picture');

            // Adicione esta linha para imprimir o caminho onde o arquivo foi armazenado
            error_log("Path: " . $path);

            $user->imagem = $path;
            $user->save();

            return response("Imagem salva com sucesso!", 200);
        }

        return response()->json([
            "message" => "Nenhum arquivo de imagem válido enviado."
        ], 400);
    }

    // get imagem by user id
    public function getImagem($id)
    {
        $user = User::find($id);
        //return last image saved on navegator
        return response()->file(storage_path("app/$user->imagem"));
        // return response()->download(storage_path("app/$user->imagem"));
    }

    public function editUser(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->phone_number = $request->phone_number;
        $user->birthday_date = $request->birthday_date;
        $user->email = $request->email;
        $user->bio = $request->bio;
        // upload imagem in storage
        if ($request->hasFile('imagem') && $request->file('imagem')->isValid()) {
            $imagem = $request->file('imagem');
            $path = $imagem->store('imagens/profile_picture');
            $user->imagem = $path;
        }
        $user->save();
        return response()->json([
            "message" => "User record updated"
        ], 201);
    }
}
