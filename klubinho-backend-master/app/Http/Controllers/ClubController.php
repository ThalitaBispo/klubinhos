<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\ClubIntegrantesController;

class ClubController extends Controller
{
    public function registerClub(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nick_club' => 'required|unique:clubs,nick_club',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Nick Club already exists'
            ], 401);
        }

        $club = new Club;
        $club->name = $request->name;
        $club->nick_club = $request->nick_club;
        $club->description = $request->description;
        $club->banner = $request->banner;
        $club->user_id = $request->user_id;
        $club->save();

        $clubIntegrantesController = new ClubIntegrantesController();
        $integranteRequest = new Request([
            'user_id' => $club->user_id,
            'club_id' => $club->id,
            'role' => 'admin',
        ]);

        $clubIntegrantesController->create($integranteRequest);

        return response()->json([
            'club' => $club,
            "message" => "Club record created"
        ], 201);
    }

    public function findClubByNickClub($nick_club)
    {
        if (Club::where('nick_club', $nick_club)->exists()) {
            $club = Club::where('nick_club', $nick_club)->get()->toJson(JSON_PRETTY_PRINT);
            return response($club, 200);
        } else {
            return response()->json([
                "message" => "Club not found"
            ], 404);
        }
    }

    // get club by id
    public function getClub($id)
    {
        if (Club::where('id', $id)->exists()) {
            $club = Club::where('id', $id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($club, 200);
        } else {
            return response()->json([
                "message" => "Club not found"
            ], 404);
        }
    }

    //upload banner_imagem
    public function uploadImagem(Request $request, $id)
    {
        $club = Club::find($id);

        if (!$club) {
            return response()->json([
                "message" => "Clube não encontrado"
            ], 404);
        }

        if ($request->hasFile('imagem') && $request->file('imagem')->isValid()) {
            $imagem = $request->file('imagem');
            
            // Adicione esta linha para imprimir as informações do arquivo
            error_log(print_r($imagem, true));

            $path = $imagem->store('imagens/banner_club');

            // Adicione esta linha para imprimir o caminho onde o arquivo foi armazenado
            error_log("Path: " . $path);

            $club->banner_imagem = $path;
            $club->save();

            return response("Imagem salva com sucesso!", 200);
        }

        return response()->json([
            "message" => "Nenhum arquivo de imagem válido enviado."
        ], 400);
    }

    public function getImagem($id)
    {
        $club = Club::find($id);
        $imagem = $user->imagem;
        return response()->json([
            "imagem" => "storage/app/" . $imagem
        ], 200);
    }
}
