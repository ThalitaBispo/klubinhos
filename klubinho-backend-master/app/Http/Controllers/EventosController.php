<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reuniao;
use App\Models\Calendar;

class EventosController extends Controller
{
    public function index($club_id){
        $reunioes = Reuniao::where('club_id', $club_id)->get();
        
        $calendarios = Calendar::where('club_id', $club_id)->get();
        
        $reunioes = $reunioes->map(function($reuniao){
            $reuniao['tipo'] = 'reuniao';
            return $reuniao;
        });
        
        $calendarios = $calendarios->map(function($calendario){
            $calendario['tipo'] = 'calendario';
            return $calendario;
        });

        $eventos = $reunioes->merge($calendarios);
        
        $eventos = $eventos->sortByDesc(function($evento){
            if ($evento['tipo'] == 'reuniao') {
                return $evento['hora_reuniao'];
            } else {
                return $evento['data_evento'];
            }
        })->values()->all();
        
        return response()->json($eventos);
    }

    public function getByClubIdAndDate(Request $request, $club_id){
        $data = $request->input('data_evento');
        
        $reunioes = Reuniao::where('club_id', $club_id)
                            ->whereDate('data_reuniao', $data)
                            ->get();
        
        $calendarios = Calendar::where('club_id', $club_id)
                               ->whereDate('data_evento', $data)
                               ->get();
        
        $reunioes = $reunioes->map(function($reuniao){
            $reuniao['tipo'] = 'reuniao';
            return $reuniao;
        });
        
        $calendarios = $calendarios->map(function($calendario){
            $calendario['tipo'] = 'calendario';
            return $calendario;
        });
        
        $eventos = $reunioes->merge($calendarios);
        
        $eventos = $eventos->sortByDesc(function($evento){
            if ($evento['tipo'] == 'reuniao') {
                return $evento['hora_reuniao'];
            } else {
                return $evento['data_evento'];
            }
        })->values()->all();
        
        return response()->json($eventos);
    }
}
