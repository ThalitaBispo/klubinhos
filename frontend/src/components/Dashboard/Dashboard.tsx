import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import Cookies from 'js-cookie';
import logo from '../../avatar/logo.jpeg';

import { FormEvent } from '../types';
import styles from './Dashboard.module.css';

interface Post {
  id: number; // Tornar id obrigatório
  name?: string;
  last_name?: string;
  content?: string;
  commentText?: string;
  liked?: boolean;
  imagem?: string;
  user_id?: number;
}

function setLikedPosts(_likedPostsData: any) {
  throw new Error('Function not implemented.');
}

export function Dashboard() {
  const [postagem, setPostagem] = useState<Post>({ id: 0, content: '' }); // Inicialize com id
  const [postagens, setPostagens] = useState<Post[]>([]);
  const [loadingPostagens, setLoadingPostagens] = useState<boolean>(false);
  const [, setStatus] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [showComments, setShowComments] = useState<{ [postId: number]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [postId: number]: string }>({}); // Alterar para um objeto
  const [comments, setComments] = useState<{ [postId: number]: any[] }>({});

  const user_id = Cookies.get('user_id');
  const club_id = Cookies.get('club_id');

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    fetchPostagens();
  }, []);

  axiosRetry(axios, {
    retries: 3,
    retryCondition: (error: AxiosError) => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response ? error.response.status === 429 : false)
      );
    },
  });

  const fetchPostagens = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/post/getAllPostByClub/${club_id}`);
      setPostagens(response.data);
      setLoadingPostagens(false);

      const likedPostsData = response.data.map((post: Post) => ({ post_id: post.id, liked: post.liked }));
      setLikedPosts(likedPostsData);

      const postIdArray = response.data.map((post: Post) => post.id);
      const commentsArray = await Promise.all(postIdArray.map((postId: number) => fetchComments(postId)));

      const commentsObject: { [key: number]: any[] } = {};
        postIdArray.forEach((postId: number, index: number) => {
          commentsObject[postId] = commentsArray[index];
        });
      setComments(commentsObject);

      setLoadingPostagens(false);
    } catch (error) {
      console.error(error);
    }
  };

  async function gravar(e: FormEvent) {
    e.preventDefault();

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/post/create',
        {
          club_id,
          user_id,
          content: postagem.content,
        },
        config
      );

      setStatus('Post cadastrado com sucesso!');
      setPostagem({ id: 0, content: '' }); // Resetar com id
      setText('');
      fetchPostagens();
      setTimeout(fetchPostagens, 1000);
    } catch (error) {
      setStatus(`Falha: ${error}`);
      alert(`Falha: ${error}`);
    }
  }

  const gravarComment = async (e: FormEvent, postId: number) => {
    e.preventDefault();
    const post = postagens.find(post => post.id === postId);
    if (!post) return;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/comment/create',
        {
          user_id,
          post_id: postId,
          content: commentText[postId] || '', // Usar commentText do estado
        },
        config
      );

      const updatedComments = await fetchComments(postId);
      setComments(prevComments => ({
        ...prevComments,
        [postId]: updatedComments,
      }));

      handleCommentChange(postId, ''); // Resetar o texto do comentário
    } catch (error) {
      setStatus(`Falha ao adicionar comentário: ${error}`);
      console.error(error);
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: value, // Atualizar o texto do comentário para o post específico
    }));
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/comment/getAllCommentsByPost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLTextAreaElement) {
      if (e.target.name === 'content') {
        setText(e.target.value);
      } else if (e.target.name === 'comment') {
        const postId = e.target.dataset.postid;
  
        // Verifica se postId está definido e é uma string
        if (postId) {
          setCommentText(prev => ({
            ...prev,
            [postId]: e.target.value, // Usar data-attribute para o postId
          }));
        }
      }
      autoExpand(e.target);
    }
  };
  

  const autoExpand = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <>
      <div className="container">
        <form onSubmit={gravar}>
          <div className="row bg-light p-3">
            <textarea
              className={styles.textoArea}
              placeholder="No que você está pensando?"
              rows={2}
              maxLength={255}
              name="content"
              value={text}
              onChange={(e) => {
                handleInputChange(e);
                setPostagem({ ...postagem, content: e.target.value });
              }}
            />
            <div className="row">
              <div className="col-sm-2 mt-4">
                <button type="submit" className={styles.buttonPurple}>
                  Postar
                </button>
              </div>
            </div>
          </div>
        </form>

        {loadingPostagens ? (
          <p>Carregando postagens...</p>
        ) : (
          postagens.map((post) => (
            <div className={styles.customPost} key={post.id}>
              <div className="d-flex">
                <a href="#" className="nav-link d-flex flex-row">
                  <img
                    src={
                      post.imagem
                        ? `http://127.0.0.1:8000/api/user/getImage/${post.user_id}`
                        : logo
                    }
                    alt="Imagem do perfil"
                    className="img-fluid rounded-circle align-self-start"
                    style={{ width: '3rem', height: '3rem' }}
                  />
                  <div className="mt-2" style={{ marginLeft: '1rem' }}>
                    <div>
                      <span>
                        {post.name} {post.last_name}
                      </span>
                    </div>
                  </div>
                </a>
                <div className="position-relative ml-auto">
                  <span className="material-symbols-outlined position-absolute" style={{ top: '0', right: '0', left: '20rem', cursor: 'pointer' }}>
                    more_horiz
                  </span>
                </div>
              </div>

              <div style={{ padding: '0 3rem' }}>
                {post.content && <p className="text-justify">{post.content}</p>}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px',
                    color: '#5b6b77',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    onClick={() => toggleComments(post.id)}
                    style={{ cursor: 'pointer', marginLeft: '1rem' }}
                  >
                    forum
                  </span>
                </div>

                <div className="mt-4">
                  {showComments[post.id] && (
                    <>
                      {comments[post.id] && comments[post.id].length > 0 ? (
                        comments[post.id].map((comment, index) => (
                          <div className="d-flex" key={index}>
                            <a href="#" className="nav-link d-flex flex-row">
                              <img
                                src={comment.user_id ? `http://127.0.0.1:8000/api/user/getImage/${comment.user_id}` : logo}
                                alt="Imagem do perfil"
                                className="img-fluid rounded-circle align-self-start"
                                style={{ width: '3rem', height: '3rem' }}
                              />
                              <div className="mt-2" style={{ marginLeft: '1rem' }}>
                                <div>
                                  <span>{comment.content}</span>
                                </div>
                              </div>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Sem comentários</p>
                      )}

                      <form onSubmit={(e) => gravarComment(e, post.id)}>
                        <textarea
                          className={styles.textoArea}
                          placeholder="Adicionar um comentário..."
                          rows={2}
                          maxLength={255}
                          name="comment"
                          data-postid={post.id} // Usar data-attribute
                          value={commentText[post.id] || ''}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        />
                        <button type="submit" className={styles.buttonPurple}>
                          Comentar
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
