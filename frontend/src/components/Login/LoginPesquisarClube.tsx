import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

interface UsuarioState {
  user_id: string | undefined;
  user_name: string;
}

interface ClubeState {
  nick_club: string;
}

export function LoginPesquisarClube() {
  // Resgatar o nome do usuário pelo back usando o id do cookie:
  const [usuario, setUsuario] = useState<UsuarioState>({
    user_id: Cookies.get('user_id'), 
    user_name: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/getUser/${usuario.user_id}`);
        const firstUserName = response.data.length > 0 ? response.data[0].name : '';
        setUsuario((prevUsuario) => ({ ...prevUsuario, user_name: firstUserName }));
      } catch (error) {
        console.error(error);
      }
    };    
    fetchData();
  }, [usuario.user_id]);

  const [clube, setClube] = useState<ClubeState>({
    nick_club: '',
  });
  
  const [, setStatus] = useState<string>('');
  const navigate = useNavigate();

  async function buscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/club/getClubByNickClub/${clube.nick_club}`,
        config
      );

      // Verifique se há pelo menos um clube na resposta
      if (response.data.length > 0) {
        const club = response.data[0];
        const club_id = club.id;
        const club_name = club.name;

        Cookies.set('temp_club_id', club_id, { expires: 7 });
        Cookies.set('club_name', club_name, { expires: 7 });

        setStatus('clube encontrado');
        setClube({ nick_club: '' });

        // Redireciona para a página desejada
        navigate('/entrarclube');
      } else {
        setStatus('Nenhum clube encontrado');
        alert('Nenhum clube encontrado');
      }
    } catch (error) {
      setStatus('Nenhum clube encontrado');
      alert('Nenhum clube encontrado');
    }
  }

  return (
    <>
      <div className={styles.welcome}>
        <p>
          <span>Bem-vindo(a) </span>
          <span className={styles.textDestaque}>{usuario.user_name}</span>
        </p>
      </div>

      <p className={styles.textLogin}>Faça parte de um clube!</p>

      <form onSubmit={buscar} className={styles.loginForm}>
        <div className="form-group">
          <label htmlFor="codeInput">Digite o apelido do clube</label>
          <input
            type="text"
            id="codeInput"
            placeholder="klubinho"
            value={clube.nick_club || ''}
            className="form-control"
            onChange={(e) => setClube({ ...clube, nick_club: e.target.value })}
            required
          />
        </div>

        <p><a href="/criarclube">Criar Novo Clube</a></p>

        <div className={styles.centerButton}>
          <button type="submit" className="btn btn-lg btn-block">Pesquisar</button>
        </div>
      </form>
    </>
  );
}
