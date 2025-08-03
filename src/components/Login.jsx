import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErro('Enter a valid email.');
      return;
    }
    setErro('');
    onLogin(email);
    navigate('/');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Welcome to SignalCheck</h1>
        <p className="login-desc">Log in to access the secret dashboard.</p>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="login-input"
        />
        {erro && <div className="login-erro">{erro}</div>}
        <button type="submit" className="login-btn">Sign in</button>
      </form>
    </div>
  );
}