import { Link } from "react-router-dom";
import capa from '../../imagens/livro.jpeg'; // Importando a imagem do livro

export function Estante() {
    const books = [
        { title: "O meu pé de laranja lima", progress: 80 },
        { title: "Aventuras de Tom Sawyer", progress: 60 },
        { title: "Dom Quixote", progress: 100 },
        { title: "Odisseia", progress: 45 },
        { title: "Os Miseráveis", progress: 20 },
        { title: "Moby Dick", progress: 10 },
    ];

    return (
        <div className="container">
            {/* Cabeçalho */}
            <div className="form-group">
                <div className="row">
                    <div className="col">
                        <b>Estante</b>
                    </div>
                    <div className="col-sm-1">
                        <Link to={'/'}>
                            <button>Filtrar</button>
                        </Link>
                    </div>
                    <div className="col-sm-2">
                        <Link to={'/'}>
                            <button>Criar estante</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Cartões com Livros */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card mb-3" style={{ border: '1px solid #ddd' }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Finalizados (56)</h6>
                            <div className="dropdown">
                                <button className="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <Link className="dropdown-item" to="#">Ver estante completa</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex flex-wrap justify-content-start">
                            {books.map((book, index) => (
                                <div key={index} className="card m-2" style={{ width: '150px', border: 'none' }}>
                                    <img src={capa} className="card-img-top" alt="Capa do Livro" style={{ width: '100%', height: 'auto' }} />
                                    <div className="card-body text-center">
                                        <h6 className="card-title" style={{ fontSize: '0.9rem' }}>{book.title}</h6>
                                        <div className="progress" style={{ height: '6px', backgroundColor: '#ddd' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${book.progress}%`, backgroundColor: '#863BE5' }}
                                                aria-valuenow={book.progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card mb-3" style={{ border: '1px solid #ddd' }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Lendo (2)</h6>
                            <div className="dropdown">
                                <button className="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <Link className="dropdown-item" to="#">Ver estante completa</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex flex-wrap justify-content-start">
                            {books.map((book, index) => (
                                <div key={index} className="card m-2" style={{ width: '150px', border: 'none' }}>
                                    <img src={capa} className="card-img-top" alt="Capa do Livro" style={{ width: '100%', height: 'auto' }} />
                                    <div className="card-body text-center">
                                        <h6 className="card-title" style={{ fontSize: '0.9rem' }}>{book.title}</h6>
                                        <div className="progress" style={{ height: '6px', backgroundColor: '#ddd' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${book.progress}%`, backgroundColor: '#863BE5' }}
                                                aria-valuenow={book.progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card mb-3" style={{ border: '1px solid #ddd' }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Favoritos (6)</h6>
                            <div className="dropdown">
                                <button className="btn dropdown-toggle" type="button" data-toggle="dropdown">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <Link className="dropdown-item" to="#">Ver estante completa</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex flex-wrap justify-content-start">
                            {books.map((book, index) => (
                                <div key={index} className="card m-2" style={{ width: '150px', border: 'none' }}>
                                    <img src={capa} className="card-img-top" alt="Capa do Livro" style={{ width: '100%', height: 'auto' }} />
                                    <div className="card-body text-center">
                                        <h6 className="card-title" style={{ fontSize: '0.9rem' }}>{book.title}</h6>
                                        <div className="progress" style={{ height: '6px', backgroundColor: '#ddd' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${book.progress}%`, backgroundColor: '#863BE5' }}
                                                aria-valuenow={book.progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
