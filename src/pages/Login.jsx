import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="r2c-login">
      <div className="r2c-login__card">
        <Link to="/" className="r2c-login__logo">
          <img src="/logo-removebg-preview.png" alt="Ready2Cop" />
        </Link>
        <h1 className="r2c-login__title">READY2COP</h1>
        <p className="r2c-login__subtitle">Espace admin</p>
        {error && <div className="r2c-login__error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="r2c-login__field">
            <label htmlFor="username">Identifiant</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="r2c-login__field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="r2c-btn" style={{width: '100%', textAlign: 'center'}}>
            <span>Se connecter</span>
          </button>
        </form>
        <Link to="/" className="r2c-login__back">
          <i className="fas fa-arrow-left"></i> Retour au site
        </Link>
      </div>
    </div>
  );
}
