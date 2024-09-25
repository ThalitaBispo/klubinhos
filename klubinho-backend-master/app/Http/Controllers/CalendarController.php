<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Calendar;

class CalendarController extends Controller
{

    // criar um evento
    public function store(Request $request)
    {
        $calendar = new Calendar;
        $calendar->titulo = $request->titulo;
        $calendar->descricao = $request->descricao;
        $calendar->data_evento = $request->data_evento;
        $calendar->hora_evento = $request->hora_evento;
        $calendar->fim_evento = $request->fim_evento;
        $calendar->club_id = $request->club_id;
        $calendar->save();
        return response()->json($calendar, 201);
    }
    
    // get all events by club_id order by date asc
    public function getAllEventsByClub($club_id)
    {
        if (Calendar::where('club_id', $club_id)->exists()) {
            $calendar = Calendar::where('club_id', $club_id)->orderBy('data_evento', 'asc')->get()->toJson(JSON_PRETTY_PRINT);
            return response($calendar, 200);
        } else {
            return response()->json([
                "message" => "Event not found"
            ], 404);
        }
    }

    // editar evento 
    public function update(Request $request, $id)
    {
        if (Calendar::where('id', $id)->exists()) {
            $calendar = Calendar::find($id);
            $calendar->titulo = is_null($request->titulo) ? $calendar->titulo : $request->titulo;
            $calendar->descricao = is_null($request->descricao) ? $calendar->descricao : $request->descricao;
            $calendar->data_evento = is_null($request->data_evento) ? $calendar->data_evento : $request->data_evento;
            $calendar->hora_evento = is_null($request->hora_evento) ? $calendar->hora_evento : $request->hora_evento;
            $calendar->fim_evento = is_null($request->fim_evento) ? $calendar->fim_evento : $request->fim_evento;
            $calendar->club_id = is_null($request->club_id) ? $calendar->club_id : $request->club_id;
            $calendar->save();

            return response()->json([
                "message" => "Event updated successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Event not found"
            ], 404);
        }
    }

    // remove event
    public function destroy($id)
    {
        if(Calendar::where('id', $id)->exists()) {
            $calendar = Calendar::find($id);
            $calendar->delete();

            return response()->json([
              "message" => "Event deleted"
            ], 202);
          } else {
            return response()->json([
              "message" => "Event not found"
            ], 404);
          }
    }

    // get calendar by id
    public function showById($id)
    {
        if (Calendar::where('id', $id)->exists()) {
            $calendar = Calendar::where('id', $id)->get()->toJson(JSON_PRETTY_PRINT);
            return response($calendar, 200);
        } else {
            return response()->json([
                "message" => "Event not found"
            ], 404);
        }
    }
}
