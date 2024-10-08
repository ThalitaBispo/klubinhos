import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios, { AxiosError } from "axios"; // Importe AxiosError para tipos de erro
import Cookies from 'js-cookie';
import styles from './Enquete.module.css';

export interface Enquete {
    id: number;
    title: string;
    description: string;
}

export function ListEnquete() {
    const [enquete, setEnquete] = useState<Enquete[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Tipagem do loading
    const [error, setError] = useState<Error | null>(null); // Tipagem do erro
    const club_id = Cookies.get('club_id');

    useEffect(() => {
        async function fetchEnquetes() {
            try {
                const response = await axios.get<Enquete[]>(`http://127.0.0.1:8000/api/enquete/getAllEnquetesByClub/${club_id}`);
                setEnquete(response.data);
            } catch (error) {
                const axiosError = error as AxiosError; // Asserção de tipo para AxiosError
                if (axiosError.response && axiosError.response.status === 404) {
                    // Se a resposta for 404, renderiza o botão para criar uma nova enquete
                    setEnquete([]);
                } else {
                    console.error(axiosError);
                    setError(axiosError);
                }
            } finally {
                setLoading(false);
            }
        }
    
        fetchEnquetes();
    }, [club_id]);

    // Função para formatar a descrição com quebra de linha a cada 60 caracteres
    const formatarDescricao = (descricao: string): string => { // Tipagem da descrição
        if (descricao.length > 60) {
            return descricao.match(/.{1,60}/g)?.join('\n') || descricao; // Verifique se a correspondência é válida
        }
        return descricao;
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar as enquetes: {error.message}</div>; // Exibir mensagem de erro
    }

    return (
        <div className="container">
            <Link className="nav-link" to="/createenquete">
                <button className="btn" style={{ backgroundColor: 'var(--purple)', color: "white" }}>
                    Criar enquete
                </button>
            </Link>
    
            <div className="row mt-4">
                <div className="col-md-8 mt-4" style={{ fontSize: '1.5rem' }}>
                    <b className="mt-4">Enquetes</b>
                </div>
            </div>
    
            {enquete.length === 0 ? (
                <div>Nenhuma enquete disponível.</div>
            ) : (
                enquete.map((enquetes) => (
                    <Link to={`/enquete/${enquetes.id}`} key={enquetes.id} className={`nav-link list-group-flush ${styles.customEnquete}`}>
                        <div className="d-flex flex-row mt-4 mb-4 align-items-center position-relative">
                            <div className="list-group-item w-100">
                                <span className="material-symbols-outlined" style={{ color: '#5b6b77' }}>ballot</span>
                                <div className="mt-1">
                                    <span className="d-block">{enquetes.title}</span>
                                    <span className="d-block" style={{ color: '#5b6b77' }}>{formatarDescricao(enquetes.description)}</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined position-absolute" style={{ color: '#5b6b77', top: '10px', right: '10px' }}>more_horiz</span>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}
