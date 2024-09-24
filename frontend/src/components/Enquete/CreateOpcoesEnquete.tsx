import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Adicione a importação de useNavigate
import Cookies from 'js-cookie';
import axios from "axios";

// Definindo o tipo para a opção
interface Option {
  titulo: string;
  description: string;
}

export function AdicionarOpcoesEnquete() {
  const [options, setOptions] = useState<Option[]>([{ titulo: '', description: '' }]); // Tipagem de options
  const [, setLastEnqueteId] = useState<number | null>(null); // Tipagem de setLastEnqueteId
  const navigate = useNavigate();
  const club_id = Cookies.get('club_id');

  useEffect(() => {
    async function fetchLastEnqueteId() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/enquete/getAllEnquetesByClub/${club_id}`);
        const enquetes = response.data;
        console.log('Enquetes data:', enquetes);

        if (enquetes.length > 0) {
          const lastEnquete = enquetes[enquetes.length - 1];
          const lastEnqueteId = lastEnquete.id;
          Cookies.set('last_enquete_id', lastEnqueteId, { expires: 7 });
          setLastEnqueteId(lastEnqueteId);
        }
      } catch (error) {
        console.error('Erro ao buscar enquetes:', error);
      }
    }

    fetchLastEnqueteId();
  }, [club_id]);

  const handleAddOption = () => {
    setOptions([...options, { titulo: '', description: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const enqueteId = Cookies.get('last_enquete_id'); // Recupera o ID da última enquete dos cookies

      // Chamada API para adicionar opções de enquete
      for (const option of options) {
        const optionResponse = await fetch('http://127.0.0.1:8000/api/enquete/createOpcao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'enquete_id': enqueteId || '', // Enviar o ID da enquete no cabeçalho da requisição
          },
          body: JSON.stringify({
            enquete_id: enqueteId,
            titulo: option.titulo,
            description: option.description,
          }),
        });

        if (!optionResponse.ok) {
          throw new Error('Falha ao criar opção');
        }

        const optionData = await optionResponse.json();
        console.log('Opção criada:', optionData);
      }

      // Redirecionar para a página de listagem de enquetes
      navigate('/listenquete');
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao adicionar opções de enquete. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="container">
      <span style={{ fontSize: "1.5rem" }}>Adicionar Opções de Enquete</span>

      <form className="mt-4" style={{ marginBottom: "3rem" }} onSubmit={handleSubmit}>
        {options.map((option, index) => (
          <div key={index} className="form-group mt-4">
            <label>Título</label>
            <input
              type="text"
              className="form-control"
              placeholder="Título"
              maxLength={60}
              value={option.titulo}
              onChange={(e) => {
                const updatedOptions = [...options];
                updatedOptions[index].titulo = e.target.value;
                setOptions(updatedOptions);
              }}
            />

            <label className="form-group mt-4">Descrição</label>
            <input
              type="text"
              className="form-control"
              placeholder="Descrição"
              maxLength={255}
              value={option.description}
              onChange={(e) => {
                const updatedOptions = [...options];
                updatedOptions[index].description = e.target.value;
                setOptions(updatedOptions);
              }}
            />

            {index > 0 && (
              <button type="button" className="btn btn-danger mt-4" onClick={() => handleRemoveOption(index)}>Remover opção</button>
            )}
          </div>
        ))}

        <button type="button" className="btn mt-4" style={{ backgroundColor: "var(--purple)", color: "var(--white)" }} onClick={handleAddOption}>Adicionar opção</button>

        <button type="submit" className="btn mt-4" style={{ backgroundColor: "var(--purple)", color: "var(--white)" }}>Salvar</button>

        <Link to={"/listenquete"}>
          <button type="button" className="btn mt-4" style={{ backgroundColor: 'var(--purple)', color: 'var(--white)', marginLeft: "1rem" }}>Cancelar</button>
        </Link>
      </form>
    </div>
  );
}
