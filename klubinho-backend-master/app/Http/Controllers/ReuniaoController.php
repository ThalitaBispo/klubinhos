<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reuniao;

class ReuniaoController extends Controller
{

    public function createReuniao(Request $request)
    {
        $reuniao = new Reuniao;
        $reuniao->titulo = $request->titulo;
        $reuniao->descricao = $request->descricao;
        $reuniao->link = $request->link;
        $reuniao->data_reuniao = $request->data_reuniao;
        $reuniao->hora_reuniao = $request->hora_reuniao;
        $reuniao->livro = $request->livro;
        $reuniao->autor = $request->autor;
        $reuniao->club_id = $request->club_id;
        $reuniao->user_id = $request->user_id;

        $participantsArray = $request->participants;
        $participantsString = implode(',', $participantsArray);
        $reuniao->participants_name = $participantsString;

        $reuniao->save();

        return response()->json([
            "message" => "Reuniao record created",
            "reuniao" => $reuniao
        ], 201);
    }

    public function getAllReuniaoByClub($club_id)
    {
        if (Reuniao::where('club_id', $club_id)->exists()) {         
            $reuniao = Reuniao::where('club_id', $club_id)
                        ->orderBy('data_reuniao', 'desc')
                        ->get()
                        ->toJson(JSON_PRETTY_PRINT);
            
            return response($reuniao, 200);
        } else {
            return response()->json([
                "message" => "Reuniao not found"
            ], 404);
        }
    }

    // get reuniao by id
    public function getReuniao($id)
    {
        $reuniao = Reuniao::find($id);

        if ($reuniao) {
            // Transformar a string de participantes em um array
            $participantsArray = explode(',', $reuniao->participants_name);
            
            // Adicionar o array de participantes aos dados da reunião
            $reuniaoData = $reuniao->toArray();
            $reuniaoData['participants_name'] = $participantsArray;

            return response()->json([
                "reuniao" => $reuniaoData
            ], 200);
        } else {
            return response()->json([
                "message" => "Reuniao not found"
            ], 404);
        }
    }


    public function createComment(Request $request)
    {
        $reuniao = new Reuniao;
        $reuniao->user_id = $request->user_id;
        $reuniao->club_id = $request->club_id;
        $reuniao->reuniao_id = $request->reuniao_id;
        $reuniao->content = $request->content;
        $reuniao->save();
        return response()->json([
            "message" => "Comment record created"
        ], 201);
    }

    public function getAllCommentsByReuniao($reuniao_id)
    {
        if (Reuniao::where('reuniao_id', $reuniao_id)->exists()) {
            $reuniao = Reuniao::where('reuniao_id', $reuniao_id)
                ->join('users', 'reuniao_comments.user_id', '=', 'users.id')
                ->select('reuniao_comments.*', 'users.name', 'users.last_name', 'users.imagem')
                ->get()->toJson(JSON_PRETTY_PRINT);
            return response($reuniao, 200);
        } else {
            return response()->json([
                "message" => "Comment not found"
            ], 404);
        }
    }

    // edit reuniao by id
    public function editReuniao(Request $request, $id)
    {
        if (Reuniao::where('id', $id)->exists()) {
            $reuniao = Reuniao::find($id);
            $reuniao->titulo = $request->titulo;
            $reuniao->descricao = $request->descricao;
            $reuniao->link = $request->link;
            $reuniao->data_reuniao = $request->data_reuniao;
            $reuniao->hora_reuniao = $request->hora_reuniao;
            $reuniao->livro = $request->livro;
            $reuniao->autor = $request->autor;

            $reuniao->save();

            return response()->json([
                "message" => "Reuniao updated successfully"
            ], 200);
        } else {
            dd($request->all()); 
            return response()->json([
                "message" => "Reuniao not found"
            ], 404);
        }
    }

    //delete reuniao by id
    public function updateReuniao(Request $request, $id)
    {
        if (Reuniao::where('id', $id)->exists()) {
            $reuniao = Reuniao::find($id);
            $reuniao->delete();

            return response()->json([
                "message" => "Reuniao deleted"
            ], 202);
        } else {
            return response()->json([
                "message" => "Reuniao not found"
            ], 404);
        }
    }
}
