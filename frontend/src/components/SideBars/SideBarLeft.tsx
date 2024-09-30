import { Link } from 'react-router-dom';
import styles from './SideBarLeft.module.css';
import Cookies from 'js-cookie';
import logo from '../../avatar/logo.jpeg';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Profile {
    id: string;
    name: string;
    last_name: string;
    club_name: string;
    imagem?: string;
}

export function SideBarRight() {
    const handleLogout = () => {
        Cookies.remove('user_id');
        Cookies.remove('token');
        Cookies.remove('club_id');
        Cookies.remove('role');
    };

    const [profile, setProfile] = useState<Profile[]>([]);
    const [, setLoading] = useState(true);
    const user_id = Cookies.get('user_id');

    const [showMoreIcons, setShowMoreIcons] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function Profile() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user/getUser/${user_id}`);
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        Profile();
    }, []);

    const handleMouseEnter = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.overflowY = 'auto'; // Ativa o scroll
        }
    };

    const handleMouseLeave = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.overflowY = 'hidden'; // Desativa o scroll
        }
    };

    const handleToggleShowMore = () => {
        setShowMoreIcons(prev => !prev);
        if (sidebarRef.current) {
            sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight; // Rola para o final da sidebar
        }
    };

    return (
        <>
            <div 
                className={`container ${styles.sideBarLeft}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={sidebarRef} // Referência ao container para controle de overflow
                style={{ overflowY: 'auto', maxHeight: '100vh' }} // Assegura que a barra de rolagem funcione
            >
                <nav className="navbar navbar-expand-md">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Alterna navegação">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className={`navbar-nav flex-column ${styles.menu}`}>
                            <span className={`${styles.logo}`}>KLUBINHOS</span>

                            <li className={`nav-item d-flex ${styles.userProfile}`}>
                                <div className="dropdown border rounded">
                                    <a className="nav-link d-flex flex-row" href="#" role="button" id="userDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {profile.map((profiles) => (
                                            <div key={profiles.id} className="d-flex" style={{ alignItems: 'center' }}>
                                                <img
                                                    src={
                                                        profiles.imagem
                                                            ? `http://127.0.0.1:8000/api/user/getImage/${user_id}`
                                                            : logo
                                                    }
                                                    alt="Imagem do perfil"
                                                    className="img-fluid rounded-circle align-self-start"
                                                    style={{ width: '3rem', height: '3rem' }}
                                                />
                                                <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                                    <div className="d-block">{profiles.name} {profiles.last_name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="userDropdown">
                                        <Link className='nav-link d-flex align-items-center' to="/profile">
                                            <span className="material-symbols-outlined">person</span>
                                            <span className='p-2'>Perfil</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href="/" onClick={handleLogout}>
                                            Logout
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className={`nav-item ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="/">
                                    <span className="material-symbols-outlined">home</span>
                                    <span className='p-2'>Home</span>
                                </Link>
                            </li>

                            <li className={`nav-item ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="/livros">
                                    <span className="material-symbols-outlined">book_2</span>
                                    <span className='p-2'>Livros</span>
                                </Link>
                            </li>

                            <li className={`nav-item ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="/estante">
                                    <span className="material-symbols-outlined">bottom_drawer</span>
                                    <span className='p-2'>Estante</span>
                                </Link>
                            </li>

                            <li className={`nav-item ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="/calendario">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    <span className='p-2'>Calendário</span>
                                </Link>
                            </li>

                            <li className={`nav-item ${styles.menuItem}`} onClick={handleToggleShowMore}>
                                <Link className='nav-link d-flex align-items-center' to="#">
                                    <span className="material-symbols-outlined">expand_circle_down</span>
                                    <span className='p-2'>Ver mais</span>
                                </Link>
                            </li>

                            {showMoreIcons && (
                                <>
                                    <li className={`nav-item ${styles.menuItem}`}>
                                        <Link className='nav-link d-flex align-items-center' to="/reunion">
                                            <span className="material-symbols-outlined">article</span>
                                            <span className='p-2'>Reunião</span>
                                        </Link>
                                    </li>
                                    <li className={`nav-item ${styles.menuItem}`}>
                                        <Link className='nav-link d-flex align-items-center' to="/listenquete">
                                            <span className="material-symbols-outlined">voting_chip</span>
                                            <span className='p-2'>Enquetes</span>
                                        </Link>
                                    </li>

                                    <li className={`nav-item ${styles.menuItem}`}>
                                        <Link className='nav-link d-flex align-items-center' to="/comunidade">
                                            <span className="material-symbols-outlined">local_library</span>
                                            <span className='p-2'>Comunidade</span>
                                        </Link>
                                    </li>
                                </>
                            )}

                            <span className='text-black-50 mt-4 ml-4'>Seus clubes (4)</span>

                            <li className={`nav-item mt-3 ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="#">
                                    <img src={logo}
                                        alt="Imagem do perfil"
                                        className="img-fluid rounded-circle align-self-start"
                                        style={{ width: '2rem', height: '2rem' }}
                                    />
                                    <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                        <div className="d-block">bookClub</div>
                                    </div>
                                </Link>
                            </li>

                            <li className={`nav-item mt-2 ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="#">
                                    <img src={logo}
                                        alt="Imagem do perfil"
                                        className="img-fluid rounded-circle align-self-start"
                                        style={{ width: '2rem', height: '2rem' }}
                                    />
                                    <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                        <div className="d-block">bookClub</div>
                                    </div>
                                </Link>
                            </li>

                            <li className={`nav-item mt-2 ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="#">
                                    <img src={logo}
                                        alt="Imagem do perfil"
                                        className="img-fluid rounded-circle align-self-start"
                                        style={{ width: '2rem', height: '2rem' }}
                                    />
                                    <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                        <div className="d-block">bookClub</div>
                                    </div>
                                </Link>
                            </li>

                            <li className={`nav-item mt-2 ${styles.menuItem}`}>
                                <Link className='nav-link d-flex align-items-center' to="#">
                                    <img src={logo}
                                        alt="Imagem do perfil"
                                        className="img-fluid rounded-circle align-self-start"
                                        style={{ width: '2rem', height: '2rem' }}
                                    />
                                    <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                        <div className="d-block">bookClub</div>
                                    </div>
                                </Link>
                            </li>

                            <div className="card-footer text-muted mt-1">
                                <Link to="#" className={`nav-link ${styles.fontPurple}`}>Mostrar mais</Link>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    );
}
