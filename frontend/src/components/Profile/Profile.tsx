import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Key, useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../avatar/logo.jpeg';
import styles from './Profile.module.css';

interface Profile {
  id: Key;
  imagem: string;
  name: string;
  last_name: string;
  bio: string;
}

interface Post {
  user_id: any;
  id: Key;
  imagem: string;
  name: string;
  last_name: string;
  content: string;
}

interface Comment {
  id: Key;
  imagem: string;
  name: string;
  last_name: string;
  content: string;
}

export function Profile() {
  const [profile, setProfile] = useState<Profile[]>([]);
  const [, setLoading] = useState(true);
  const [loadingPostagens, setLoadingPostagens] = useState(false);
  const [postagens, setPostagens] = useState<Post[]>([]);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [commentText, setCommentText] = useState('');
  const user_id = Cookies.get('user_id');

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/getUser/${user_id}`);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [user_id]);

  const fetchPostagens = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/post/getAllPostByUser/${user_id}`);
      setPostagens(response.data);
      setLoadingPostagens(false);

      const postIdArray = response.data.map((post: Post) => post.id);
      const commentsArray = await Promise.all(postIdArray.map(fetchComments));

      const commentsObject: { [key: string]: Comment[] } = {};
      postIdArray.forEach((postId: Key, index: number) => {
        commentsObject[postId] = commentsArray[index];
      });
      setComments(commentsObject);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPostagens();
  }, [user_id]);

  const fetchComments = async (postId: Key) => {
    if (postId === null || postId === undefined) {
      return [];
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/comment/getAllCommentsByPost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const gravarComment = async (e: React.FormEvent<HTMLFormElement>, postId: Key) => {
    e.preventDefault();
    const post = postagens.find(post => post.id === postId);
    if (!post) return;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/comment/create',
        {
          user_id,
          post_id: postId,
          content: commentText,
        },
        config
      );

      const updatedComments = await fetchComments(postId);
      setComments(prevComments => ({
        ...prevComments,
        [postId]: updatedComments,
      }));

      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComments = (postId: Key) => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <>
      {profile.map(profiles => (
        <div key={profiles.id} className="container">
          <img 
            src="https://i.pinimg.com/564x/7f/06/16/7f06166fd703e6549ae9baea4a5c7519.jpg"
            alt="Imagem"
            className="img-fluid mt-3"
            style={{ width: "800px", height: '300px', objectFit: 'cover' }}
          />
          <img
            src={profiles.imagem ? `http://127.0.0.1:8000/api/user/getImage/${user_id}` : logo}
            alt="Imagem do perfil"
            className="img-fluid rounded-circle align-self-start"
            style={{ maxWidth: "100px", marginTop: '-3.125rem', marginLeft: '2rem' }}
          />
          <Link to={"/editprofile"}>
            <span className="material-symbols-outlined mt-2" style={{ color: 'var(--purple)', float: 'right', 
            border: '1px solid var(--purple)', borderRadius: '10px', padding: '0.25rem', fontSize: '1.25rem' }}>edit</span>
          </Link>
          <div className="text-justify mt-4">
            <p>
              <b style={{ fontSize: '1.5rem' }}>{profiles.name} {profiles.last_name}</b>
            </p>
            <p style={{ marginTop: '-1rem' }}>{profiles.bio}</p>
            <p style={{ marginTop: '-0.6rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#c2c2c2' }}>link</span>
              <a href="#" style={{ marginLeft: '0.5rem' }}>amazon.kindle/{profiles.name}</a>
            </p>
          </div>
          <div style={{ marginTop: '3rem' }}>
            <b style={{ fontSize: '1.25rem' }}>Publicações</b>
          </div>
          <hr style={{ borderTop: '1px solid gray', marginTop: '2rem' }} />
          {loadingPostagens ? (
            <p>Carregando postagens...</p>
          ) : (
            postagens.map(post => (
              <div key={post.id} style={{ margin: '1rem' }}>
                <div className="d-flex mt-2">
                  <a href="#" className="nav-link d-flex flex-row mt-4">
                    <img
                      src={post.imagem ? `http://127.0.0.1:8000/api/user/getImage/${post.user_id}` : logo}
                      alt="Imagem do perfil"
                      className="img-fluid rounded-circle align-self-start"
                      style={{ maxWidth: '40px' }}
                    />
                    <div className="mt-2" style={{ marginLeft: '1rem' }}>
                      <span>{post.name} {post.last_name}</span>
                    </div>
                  </a>
                </div>
                <div style={{ padding: '0 3rem' }}>
                  <span className="text-justify" style={{ fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    {post.content}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', color: '#5b6b77' }}>
                    <span className="material-symbols-outlined" style={{ marginLeft: '1rem', cursor: 'pointer' }} onClick={() => toggleComments(post.id)}>
                      forum
                    </span>
                  </div>
                  <div className="mt-4">
                    {showComments[post.id] && (
                      <>
                        {comments[post.id]?.length > 0 ? (
                          comments[post.id].map(comment => (
                            <div key={comment.id} className={`d-flex ${styles.customComments}`}>
                              <img
                                src={logo}
                                alt="Imagem do perfil"
                                className="img-fluid rounded-circle align-self-start"
                                style={{ maxWidth: '30px', marginRight: '1rem' }}
                              />
                              <div>
                                <p className={`${styles.commentName}`}>{comment.name} {comment.last_name}</p>
                                <p className="mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Seja o(a) primeiro(a) a comentar esta postagem</p>
                        )}
                        <form onSubmit={(e) => gravarComment(e, post.id)}>
                          <div className="d-flex" style={{ padding: '1rem' }}>
                            <img
                              src={logo}
                              alt="Imagem do perfil"
                              className="img-fluid rounded-circle align-self-start"
                              style={{ maxWidth: '30px', marginRight: '1rem' }}
                            />
                            <textarea
                              className="form-control"
                              rows={1}
                              maxLength={255}
                              name="comment"
                              style={{ resize: 'none' }}
                              placeholder="Faça um comentário..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit">Comentar</button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
                <hr style={{ borderTop: '1px solid gray', marginTop: '2rem' }} />
              </div>
            ))
          )}
        </div>
      ))}
    </>
  );
}
