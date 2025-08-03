import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function getGoogleMapsLink(loc) {
  // Se for formato Lat: x, Lng: y
  if (loc && loc.startsWith('Lat:')) {
    const match = loc.match(/Lat: ([\-\d\.]+), Lng: ([\-\d\.]+)/);
    if (match) {
      const lat = match[1];
      const lng = match[2];
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
  }
  return null;
}

export default function LinksList() {
  const [links, setLinks] = useState([]);
  const usuario = localStorage.getItem('usuario');

  async function fetchLinks() {
    const { data, error } = await supabase
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
      {links.length === 0 && <p style={{ color: 'var(--cinza-conspiracao)', textAlign: 'center', margin: '0 0 1.5rem 0', width: '100%' }}>No links created yet.</p>}
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
      <button onClick={fetchLinks} style={{
        background: 'var(--cinza-conspiracao)',
        color: 'var(--branco-confissao)',
        borderRadius: 8,
        padding: '0.5rem 1.5rem',
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
        marginTop: 10,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>Refresh list</button>
    </div>
  );
}