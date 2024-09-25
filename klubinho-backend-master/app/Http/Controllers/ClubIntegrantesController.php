<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClubIntegrantes;



class ClubIntegrantesController extends Controller
{
    public function create(Request $request)
    {
        $clubIntegrante = new ClubIntegrantes;
        $clubIntegrante->user_id = $request->user_id;
        $clubIntegrante->club_id = $request->club_id;
        $clubIntegrante->role = $request->role;
        $clubIntegrante->save();
        return response()->json([
            "message" => "Club integrante record created"
        ], 201);
    }

    public function getAllIntegrantesByClub($club_id)
    {
        if (ClubIntegrantes::where('club_id', $club_id)->exists()) {
            $clubIntegrantes = ClubIntegrantes::where('club_id', $club_id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($clubIntegrantes, 200);
        } else {
            return response()->json([
                "message" => "Club integrantes not found"
            ], 404);
        }
    }

    public function getAllIntegrantesWithUserByClub($club_id)
    {
        if (ClubIntegrantes::where('club_id', $club_id)->exists()) {
            $clubIntegrantes = ClubIntegrantes::where('club_id', $club_id)
            ->join('users', 'club_integrantes.user_id', '=', 'users.id')
            ->select('club_integrantes.*', 'users.name', 'users.last_name', 'users.imagem')
            ->get()->toJson(JSON_PRETTY_PRINT);
            return response($clubIntegrantes, 200);
        } else {
            return response()->json([
                "message" => "Club integrantes not found"
            ], 404);
        }
    }

    public function updateClubIntegrante(Request $request, $user_id)
    {
        if (ClubIntegrantes::where('user_id', $user_id)->exists()) {
            $clubIntegrante = ClubIntegrantes::find($user_id);
            $clubIntegrante->user_id = $request->user_id;
            $clubIntegrante->club_id = $request->club_id;
            $clubIntegrante->role = $request->role;
            $clubIntegrante->save();

            return response()->json([
                "message" => "Club integrante updated successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Club integrante not found"
            ], 404);
        }
    }

    public function getNumberOfIntegrantesByClub($club_id)
    {
        $numberOfIntegrantes = ClubIntegrantes::where('club_id', $club_id)->count();

        if ($numberOfIntegrantes > 0) {
            return response()->json([
                "club_id" => $club_id,
                "number_of_integrantes" => $numberOfIntegrantes
            ], 200);
        } else {
            return response()->json([
                "message" => "Club integrantes not found for club_id: " . $club_id
            ], 404);
        }
    }

    public function getRoleByClubAndUser($club_id, $user_id)
    {
        if (ClubIntegrantes::where('club_id', $club_id)->where('user_id', $user_id)->exists()) {
            $role = ClubIntegrantes::where('club_id', $club_id)->where('user_id', $user_id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($role, 200);
        } else {
            return response()->json([
                "message" => "Role not found"
            ], 404);
        }
    }

}
