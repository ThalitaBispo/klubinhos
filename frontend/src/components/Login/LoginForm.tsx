import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface CadastroState {
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export function LoginForm() {
  const [cadastro, setCadastro] = useState<CadastroState>({
    name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const [, setStatus] = useState<string>('');
  const navigate = useNavigate();

  async function gravar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/register',
        {
          name: cadastro.name,
          last_name: cadastro.last_name,
          email: cadastro.email,
          phone_number: cadastro.phone_number,
          password: cadastro.password,
        },
        config
      );

      setStatus('cadastro realizado');
      alert('Usuário cadastrado com sucesso!');
      setCadastro({
        name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
      });

      // Verifique se a resposta contém o id
      const { user } = response.data;
      console.log(user);

      // Armazene o id do usuário no cookie
      Cookies.set('user_id', user.id, { expires: 7 });

      // Redireciona para a página desejada
      navigate('/bemvindo');
    } catch (error) {
      setStatus(`Falha: ${error}`);
      alert(`Falha: ${error}`);
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
          <p>Tem uma conta?</p>
          <p className={styles.textDestaque}><Link to="/">Entre</Link></p>
        </p>
      </div>

      <p className={styles.textLogin}>Cadastro</p>

      <form onSubmit={gravar} className={styles.loginForm}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="nameInput">Nome</label>
              <input
                name="name"
                type="text"
                id="nameInput"
                placeholder="Nome"
                value={cadastro.name}
                className="form-control"
                onChange={(e) => setCadastro({ ...cadastro, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="lastnameInput">Sobrenome</label>
              <input
                name="last_name"
                type="text"
                id="lastnameInput"
                placeholder="Sobrenome"
                value={cadastro.last_name}
                className="form-control"
                onChange={(e) => setCadastro({ ...cadastro, last_name: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inputEmail">Informe seu email</label>
          <input
            name="email"
            id="inputEmail"
            placeholder="E-mail"
            value={cadastro.email}
            className="form-control"
            onChange={(e) => setCadastro({ ...cadastro, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telInput">Telefone</label>
          <input
            name="phone_number"
            type="text"
            id="telInput"
            placeholder="Nº de celular"
            value={cadastro.phone_number}
            className="form-control"
            onChange={(e) => setCadastro({ ...cadastro, phone_number: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordInput">Informe sua senha</label>
          <input
            name="password"
            type="password"
            placeholder="Senha"
            id="passwordInput"
            value={cadastro.password}
            className="form-control"
            onChange={(e) => setCadastro({ ...cadastro, password: e.target.value })}
            required
          />
        </div>

        <div className={styles.centerButton}>
          <button type="submit" className="btn btn-lg btn-block">Cadastrar</button>
        </div>
      </form>
    </>
  );
}
