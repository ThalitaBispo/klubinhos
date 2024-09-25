<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enquetes;
use App\Models\EnquetesOpcoes;

class EnquetesController extends Controller
{
    public function create(Request $request)
    {
        $enquete = new Enquetes;
        $enquete->user_id = $request->user_id;
        $enquete->club_id = $request->club_id;
        $enquete->title = $request->title;
        $enquete->description = $request->description;
        $enquete->save();
        return response()->json([
            "enquete:" => $enquete,
            "message" => "Enquete record created"
        ], 201);
    }

    // get all enquetes by club_id
    public function getAllEnquetesByClub($club_id)
    {
        if (Enquetes::where('club_id', $club_id)->exists()) {
            $enquete = Enquetes::where('club_id', $club_id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($enquete, 200);
        } else {
            return response()->json([
                "message" => "Enquete not found"
            ], 404);
        }
    }

    //alter status enquete
    public function alterStatusEnquete(Request $request, $id)
    {
        if (Enquetes::where('id', $id)->exists()) {
            $enquete = Enquetes::find($id);
            $enquete->status = $request->status;
            $enquete->save();

            return response()->json([
                "message" => "Enquete updated successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Enquete not found"
            ], 404);
        }
    }

    //edit enquete
    public function updateEnquete(Request $request, $id)
    {
        if (Enquetes::where('id', $id)->exists()) {
            $enquete = Enquetes::find($id);
            $enquete->title = is_null($request->title) ? $enquete->title : $request->title;
            $enquete->description = is_null($request->description) ? $enquete->description : $request->description;
            $enquete->save();

            return response()->json([
                "message" => "Enquete updated successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Enquete not found"
            ], 404);
        }
    }

    public function destroy($id)
    {
        if (Enquetes::where('id', $id)->exists()) {
            $enquete = Enquetes::find($id);
            $enquete->delete();

            return response()->json([
                "message" => "Enquete deleted"
            ], 202);
        } else {
            return response()->json([
                "message" => "Enquete not found"
            ], 404);
        }
    }

    public function createOpcao(Request $request)
    {
        $opcao = new EnquetesOpcoes;
        $opcao->enquete_id = $request->enquete_id;
        $opcao->titulo = $request->titulo;
        $opcao->description = $request->description;
        $opcao->save();
        return response()->json([
            "message" => "Opcao record created"
        ], 201);
    }

    public function getOpcoesByEnquete($enquete_id)
    {
        if (EnquetesOpcoes::where('enquete_id', $enquete_id)->exists()) {
            $opcao = EnquetesOpcoes::where('enquete_id', $enquete_id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($opcao, 200);
        } else {
            return response()->json([
                "message" => "Opcao not found"
            ], 404);
        }
    }

    public function destroyOpcao($id)
    {
        if (EnquetesOpcoes::where('id', $id)->exists()) {
            $opcao = EnquetesOpcoes::find($id);
            $opcao->delete();

            return response()->json([
                "message" => "Opcao deleted"
            ], 202);
        } else {
            return response()->json([
                "message" => "Opcao not found"
            ], 404);
        }
    }

    public function updateOpcao(Request $request, $id)
    {
        if (EnquetesOpcoes::where('id', $id)->exists()) {
            $opcao = EnquetesOpcoes::find($id);
            $opcao->title = is_null($request->title) ? $opcao->title : $request->title;
            $opcao->description = is_null($request->description) ? $opcao->description : $request->description;
            $opcao->save();

            return response()->json([
                "message" => "Opcao updated successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Opcao not found"
            ], 404);
        }
    }

    public function getAllOpcoesByEnquete($enquete_id)
    {
        if (EnquetesOpcoes::where('enquete_id', $enquete_id)->exists()) {
            $opcao = EnquetesOpcoes::where('enquete_id', $enquete_id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($opcao, 200);
        } else {
            return response()->json([
                "message" => "Opcao not found"
            ], 404);
        }
    } 
}
