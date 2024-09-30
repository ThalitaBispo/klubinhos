import { useState } from 'react';
import { Pagination } from 'react-bootstrap';
import capa from '../../imagens/livro.jpeg';

export function Comunidade() {
    // Estado para gerenciar a página atual
    const [activePage, setActivePage] = useState(1);

    // Número de cards por linha e por página
    const cardsPerRow = 3;
    const rowsPerPage = 4;
    const cardsPerPage = cardsPerRow * rowsPerPage;

    // Função para mudar a página
    const handlePageChange = (pageNumber: number) => {
        setActivePage(pageNumber);
    };

    // Lista de cards (adicionados mais cards para ter duas páginas)
    const cards = [
        { title: "O meu pé de laranja lima", date: "01/10/2024 - 15/10/2024" },
        { title: "Aventuras de Tom Sawyer", date: "05/10/2024 - 20/10/2024" },
        { title: "Dom Quixote", date: "10/10/2024 - 25/10/2024" },
        { title: "O meu pé de laranja lima", date: "01/10/2024 - 15/10/2024" },
        { title: "Aventuras de Tom Sawyer", date: "05/10/2024 - 20/10/2024" },
        { title: "Dom Quixote", date: "10/10/2024 - 25/10/2024" },
        { title: "O meu pé de laranja lima", date: "01/10/2024 - 15/10/2024" },
        { title: "Aventuras de Tom Sawyer", date: "05/10/2024 - 20/10/2024" },
        { title: "Dom Quixote", date: "10/10/2024 - 25/10/2024" },
        { title: "O meu pé de laranja lima", date: "01/10/2024 - 15/10/2024" },
        { title: "Aventuras de Tom Sawyer", date: "05/10/2024 - 20/10/2024" },
        { title: "Dom Quixote", date: "10/10/2024 - 25/10/2024" },
        { title: "Odisseia", date: "01/11/2024 - 15/11/2024" },
        { title: "Os Miseráveis", date: "01/12/2024 - 20/12/2024" },
        { title: "Moby Dick", date: "10/12/2024 - 30/12/2024" },
        { title: "A Metamorfose", date: "05/01/2025 - 20/01/2025" }
    ];

    // Calcula o número total de páginas
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    // Seleciona os cards da página ativa
    const currentCards = cards.slice(
        (activePage - 1) * cardsPerPage,
        activePage * cardsPerPage
    );

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-md-8 mt-3" style={{ fontSize: '1.5rem' }}>
                    <b>Comunidade de leitura</b>
                </div>
            </div>

            {/* Renderiza os cards em linhas de três */}
            {Array.from({ length: Math.ceil(currentCards.length / cardsPerRow) }, (_, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {currentCards
                        .slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow)
                        .map((card, cardIndex) => (
                            <div className="col-md-4" key={cardIndex}>
                                <div className="card mb-3" style={{ maxWidth: '100%' }}>
                                    <div className="row no-gutters">
                                        <div className="col-md-4">
                                            <img
                                                src={capa}
                                                className="card-img"
                                                alt="Capa do Livro"
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </div>
                                        <div className="col-md-8 d-flex align-items-center">
                                            <div className="card-body">
                                                <p className="card-title">{card.title}</p>
                                                <p className="card-text">{card.date}</p>
                                                <a href="#" className="btn" style={{ backgroundColor: '#863BE5', color: '#fff' }}>Me juntar à leitura</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ))}

            {/* Paginação */}
            <Pagination>
                {[...Array(totalPages)].map((_, pageIndex) => (
                    <Pagination.Item
                        key={pageIndex}
                        active={pageIndex + 1 === activePage}
                        onClick={() => handlePageChange(pageIndex + 1)}
                        style={{
                            backgroundColor: pageIndex + 1 === activePage ? '#863BE5' : '',
                            borderColor: pageIndex + 1 === activePage ? '#863BE5' : '',
                            color: pageIndex + 1 === activePage ? '#fff' : '',
                        }}
                    >
                        {pageIndex + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}
