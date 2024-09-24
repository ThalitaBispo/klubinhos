import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './Login.module.css';

interface CadastroState {
  name: string;
  nick_club: string;
}

export function LoginCriarClube() {
  const [cadastro, setCadastro] = useState<CadastroState>({
    name: '',
    nick_club: '',
  });
  
  const [, setStatus] = useState<string>('');
  const navigate = useNavigate();

  // Recupere o id do usuário do cookie
  const user_id = Cookies.get('user_id');
  console.log('ID do usuário:', user_id);

  async function gravar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/club/register',
        {
          name: cadastro.name,
          nick_club: cadastro.nick_club,
          user_id: user_id, // Adicione o user_id ao corpo da solicitação
        },
        config
      );
      
      console.log(response);

      setStatus('clube criado');
      alert('Clube criado com sucesso!');
      setCadastro({
        name: '',
        nick_club: '',
      });

      // Redireciona para a página desejada
      navigate('/');
    } catch (error) {
      setStatus(`Falha: ${error}`);
      alert(`Falha: ${error}`);
    }
  }

  return (
    <>
      <div className={styles.welcome}>
        <p>
          <span>Bem-vindo(a) </span>
        </p>
      </div>

      <p className={styles.textLogin}>Crie um Clube</p>

      <form onSubmit={gravar} className={styles.loginForm}>
        <div className="form-group">
          <label htmlFor="clubeInput">Nome do Clube</label>
          <input
            type="text"
            id="clubeInput"
            placeholder="Nome do Clube"
            value={cadastro.name}
            className="form-control"
            onChange={(e) => setCadastro({ ...cadastro, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endClube">Endereço do Clube</label>
          <input
            type="text"
            id="endClube"
            placeholder="meuklubinho"
            value={cadastro.nick_club}
            className="form-control"
            onChange={(e) => setCadastro({ ...cadastro, nick_club: e.target.value })}
            required
          />
        </div>

        <p><a href="/pesquisarclube">Buscar Clube Existente</a></p>

        <div className={styles.centerButton}>
          <button type="submit" className="btn btn-lg btn-block">Criar Clube</button>
        </div>
      </form>
    </>
  );
}
