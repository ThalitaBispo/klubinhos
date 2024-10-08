import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { SideBarRight } from '../SideBars/SideBarLeft';
import { SideBarLeft } from '../SideBars/SideBarRight';
import { Dashboard } from './Dashboard';
import styles from './Dashboard.module.css';
import { Enquete } from '../Enquete/Enquete';
import { CreateEnquete } from '../Enquete/CreateEnquete';
import { AdicionarOpcoesEnquete } from '../Enquete/CreateOpcoesEnquete';
import { Profile } from '../Profile/Profile';
import { EditProfile } from '../Profile/EditProfile';
import { ListEnquete } from '../Enquete/ListEnquete';
import { Reunion } from '../Reunion/Reunion';
import { CreateReunion } from '../Reunion/CreateReunion';
import { EditReunion } from '../Reunion/EditReunion';
import { Livros } from '../Livros/Livros';
import { Calendario } from '../Agenda/Calendario';
import { CreateCalendar } from '../Agenda/CreateCalendar';
import { EditCalendar } from '../Agenda/EditCalendar';
import { Comunidade } from '../Comunidade/ComunidadeLeitura';
import { Estante } from '../Estante/Estante';

interface Clube {
    name: string;
}

function MainContent() {
    const location = useLocation(); // Detecta a rota atual
    const [nameClub, setNameClub] = useState<Clube>({ name: '' });
    const [, setShowNotifications] = useState(false);
    const club_id = Cookies.get('club_id');
    
    const role = Cookies.get('role');
    const isAdmin = role === 'admin';

    useEffect(() => {
        async function fetchData() {
            try {
                const clubResponse = await axios.get(`http://localhost:8000/api/club/getClubById/${club_id}`);
                setNameClub(clubResponse.data[0]);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(prevState => !prevState);
    };

    // Verifica se a rota atual é "/comunidade" ou "/estante"
    const isComunidadeRoute = location.pathname === '/comunidade';
    const isEstanteRoute = location.pathname === '/estante';
    
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar direita */}
                <div className={`col-md-3 ${styles.sideBarLeft}`}>
                    <SideBarRight />
                </div>

                {/* Ajusta a largura da coluna central se estiver na rota "comunidade" */}
                <div className={isComunidadeRoute || isEstanteRoute ? "col-md-8" : "col-md-5"} style={{ maxHeight: '50%', overflowY: 'auto' }}>
                    <div className="row">
                        <div className="col-md-6 mt-4">
                            <b>{nameClub.name}</b>
                        </div>
                        {isAdmin && (
                            <div className='col-md-6 mt-4 d-flex justify-content-end' style={{ paddingRight: '4rem' }}>
                                <span className="material-symbols-outlined" data-toggle="modal" data-target="#modalExemplo" onClick={() => toggleNotifications()} style={{ cursor: 'pointer' }}>notifications</span>
                            </div>
                        )}
                    </div>
                    <hr style={{ borderTop: '2px solid gray' }} />
                    <main>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/enquete" element={<Enquete />} />
                            <Route path="/listenquete" element={<ListEnquete />} />
                            <Route path="/createenquete" element={<CreateEnquete />} />
                            <Route path="/reunion" element={<Reunion />} />
                            <Route path="/createreunion" element={<CreateReunion />} />
                            <Route path="/editreunion/:id" element={<EditReunion />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/editprofile" element={<EditProfile />} />
                            <Route path="/livros" element={<Livros />} />
                            <Route path="/calendario" element={<Calendario />} />
                            <Route path='/createcalendario' element={<CreateCalendar />} />
                            <Route path='/editcalendario/:id' element={<EditCalendar />} />
                            <Route path='/adicionar-enquete' element={<AdicionarOpcoesEnquete />} />
                            <Route path='/comunidade' element={<Comunidade />} />
                            <Route path='/estante' element={<Estante />} />
                        </Routes>
                    </main>
                </div>

                {/* Exibe SideBarLeft somente se a rota atual não for "/comunidade" ou "/estante" */}
                {!isComunidadeRoute && !isEstanteRoute && (
                    <div className="col-md-4" style={{ position: 'sticky', top: 0 }}>
                        <SideBarLeft />
                    </div>
                )}
            </div>
        </div>
    );
}

export function RoutesDashboard() {
    return (
        <BrowserRouter>
            <MainContent />
        </BrowserRouter>
    );
}
