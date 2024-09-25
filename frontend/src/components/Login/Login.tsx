import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface LoginState {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState<LoginState>({
    email: '',
    password: '',
  });
  const [, setStatus] = useState<string>('');

  // Usar a variável de ambiente do Create React App
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  async function gravar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/login`, // Usando a variável de ambiente
        {
          email: login.email,
          password: login.password,
        },
        config
      );

      const { token, user, club_id, role } = response.data;

      // Armazene o token no cookie
      Cookies.set('token', token, { expires: 7 });

      // Armazene o id do usuário no cookie
      Cookies.set('user_id', user.id, { expires: 7 });

      // Armazene o papel do usuário no cookie
      Cookies.set('role', role, { expires: 7 });

      // Armazene o id do clube no cookie, se club_id não for nulo
      if (club_id !== null && club_id !== undefined) {
        Cookies.set('club_id', club_id, { expires: 7 });
      }

      // Verificar club_id após o login
      if (!club_id || club_id === 'null' || club_id === 'undefined') {
        navigate('/bemvindo');
      } else {
        setStatus('Login feito com sucesso');
        setLogin({ email: '', password: '' });

        // Atualiza a página para o App.tsx verificar a presença dos cookies
        window.location.reload();
      }
    } catch (error: any) {
      setStatus(`Falha: ${error.message}`);
      alert('Usuário ou senha inválidos.');
    }
  }

  return (
    <>
      <div className={styles.conteudo}>
        <p className={styles.message}>
          <span>Bem-vindo(a) ao </span>
          <span className={styles.textDestaque}>Klubinhos</span>
        </p>

        <p>
          <p>Sem conta?</p>
          <p className={styles.textDestaque}>
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </p>
      </div>

      <p className={styles.textLogin}>Login</p>

      <form onSubmit={gravar} className={styles.loginForm}>
        <div className="form-group">
          <label htmlFor="emailInput">Entre com o seu e-mail</label>
          <input
            type="text"
            id="emailInput"
            placeholder="e-mail"
            value={login.email}
            className="form-control"
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passInput">Entre com a sua senha</label>
          <input
            type="password"
            id="passInput"
            placeholder="senha"
            value={login.password}
            className="form-control"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
          />
        </div>
        <p><a href="#">Esqueceu a senha?</a></p>

        <div className={styles.centerButton}>
          <button type="submit" className="btn btn-lg btn-block">
            Entrar
          </button>
        </div>
      </form>
    </>
  );
}
