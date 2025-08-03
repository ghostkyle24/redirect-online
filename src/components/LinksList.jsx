import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function getGoogleMapsLink(loc) {
  // Se for lat,lng, retorna direto
  const match = loc && loc.match(/([\-\d.]+),\s*([\-\d.]+)/);
  if (match) {
    return `https://www.google.com/maps?q=${match[1]},${match[2]}`;
  }
  // Se for texto, faz busca textual
  if (loc && loc.length > 0) {
    return `https://www.google.com/maps/search/${encodeURIComponent(loc)}`;
  }
  return null;
}

export default function LinksList() {
  const [links, setLinks] = useState([]);
  const usuario = localStorage.getItem('usuario');

  async function fetchLinks() {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('email', usuario)
      .order('created_at', { ascending: false });
    setLinks(data || []);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center', width: '100%' }}>
      <h3 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', margin: '1.5rem 0 1rem 0', width: '100%' }}>Your tracking links</h3>
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
      {links.length === 0 && <p style={{ color: 'var(--cinza-conspiracao)', textAlign: 'center', margin: '0 0 1.5rem 0', width: '100%' }}>No links created yet.</p>}
      {links.map(link => (
        <div key={link.id} style={{
          background: 'var(--fundo-destaque)',
          borderRadius: 10,
          margin: '1rem auto',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(76,76,76,0.08)',
          maxWidth: 420,
          textAlign: 'left'
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
                          display: 'block',
                          marginTop: 8,
                          background: '#25d366',
                          color: '#fff',
                          borderRadius: 6,
                          padding: '0.3rem 1rem',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          fontSize: 14,
                          textAlign: 'center',
                          boxShadow: '0 2px 8px #25d36633',
                          transition: 'background 0.2s',
                        }}
                      >Open in Google Maps</a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}