import { useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ptBR } from 'date-fns/locale/pt-BR';
import { format, addDays } from 'date-fns';
import { Link } from "react-router-dom";
import styles from './Calendario.module.css';

interface Calendario {
  data_reuniao: string; 
  id: string; 
  titulo: string; 
  descricao: string; 
  hora_reuniao: string; 
  data_evento: string; 
  hora_evento: string;
}

interface Event {
  id: string; 
  titulo: string; 
  descricao: string; 
  data_evento: string; 
  hora_evento: string; 
  tipo: 'reuniao' | 'evento'; // Definindo tipos específicos
}

export function Calendario() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const club_id = Cookies.get('club_id');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        const response = await axios.get(`http://127.0.0.1:8000/api/eventos/${club_id}?data_evento=${formattedDate}`);

        const allEvents: Event[] = response.data.map((event: Calendario) => {
          return {
            id: event.id,
            titulo: event.titulo,
            descricao: event.descricao,
            data_evento: event.data_evento,
            hora_evento: event.hora_evento,
            tipo: event.data_reuniao ? 'reuniao' : 'evento', // Usando lógica para definir tipo
          };
        });

        // Ordenar eventos por data crescente
        allEvents.sort((a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime());
        setEvents(allEvents); // Agora deve funcionar sem erros
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchEvents();
  }, [club_id]);

  // Organizando os eventos por data
  const eventsByDate: { [key: string]: Event[] } = {};
  events.forEach(event => {
    const eventDate = new Date(event.data_evento);
    const formattedDate = format(addDays(eventDate, 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    if (!eventsByDate[formattedDate]) {
      eventsByDate[formattedDate] = [];
    }
    eventsByDate[formattedDate].push(event);
  });

  // Função para formatar a descrição
  const formatarDescricao = (descricao: string) => {
    if (descricao.length > 60) {
      return descricao.match(/.{1,60}/g)?.join('\n') || descricao;
    }
    return descricao;
  };
 
  return (
    <div className="container mb-4">
      <div className="form-group">
        <div className="row">
          <div className="col">
            <b>Calendário</b>
          </div>
          <div className="col-md-4">
            <Link to={'/createcalendario'}>
              <button>Criar evento</button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        Object.keys(eventsByDate).map(date => (
          <div key={date}>
            <div className="row mt-4">
              <div className="col">
                <span className="mt-4">{date}</span>
              </div>
            </div>

            <ul className={`list-group`}>
              {eventsByDate[date].map(event => (
                <Link key={event.id} className='nav-link' to={event.tipo === 'reuniao' ? `/editreunion/${event.id}` : `/editcalendario/${event.id}`}>
                    <li className={`list-group-item mt-4 ${styles.customEvent} position-relative`}>
                        <span className="material-symbols-outlined" style={{ color: '#5b6b77' }}>
                            {event.tipo === 'reuniao' ? 'connect_without_contact' : 'today'}
                        </span>
                        <div className='d-flex'>
                            <div className="mt-1">
                                <span className="d-block">{event.titulo}</span>
                                <span style={{ color: '#5b6b77' }}>{formatarDescricao(event.descricao)}</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined position-absolute" style={{ color: '#5b6b77', top: '20px', right: '50px' }}>more_horiz</span>
                    </li>
                </Link>
              ))}
            </ul> 
          </div>
        ))
      )}
    </div>
  );
}
