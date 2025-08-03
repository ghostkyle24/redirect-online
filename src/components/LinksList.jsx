import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function getGoogleMapsLink(destino) {
  // Se destino for um link do tipo https://maps.google.com/?q=lat,lng ou similar
  const match = destino && destino.match(/([-\d.]+),\s*([-\d.]+)/);
  if (match) {
    return `https://www.google.com/maps?q=${match[1]},${match[2]}`;
  }
  return null;
}

export default function LinksList() {
  const [links, setLinks] = useState([]);
  const usuario = localStorage.getItem('usuario');
  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('email', usuario)
        .order('created_at', { ascending: false });
      setLinks(data || []);
    }
    fetchLinks();
  }, []);

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center', width: '100%' }}>
      <h3 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', margin: '1.5rem 0 1rem 0', width: '100%' }}>Your tracking links</h3>
      {links.length === 0 && <p style={{ color: 'var(--cinza-conspiracao)', textAlign: 'center', margin: '0 0 1.5rem 0', width: '100%' }}>No links created yet.</p>}
      {links.map(link => {
        const gmaps = getGoogleMapsLink(link.destino);
        return (
          <div key={link.id} style={{
            background: 'var(--fundo-destaque)',
            borderRadius: 10,
            margin: '1rem auto',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(76,76,76,0.08)',
            maxWidth: 420,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div>
              <b style={{ color: 'var(--ouro-tentacao)' }}>{link.url}</b>
              <div style={{ fontSize: 14, color: 'var(--cinza-conspiracao)' }}>{link.destino}</div>
            </div>
            {gmaps && (
              <a
                href={gmaps}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25d366',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '0.4rem 1rem',
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  marginLeft: 8,
                  display: 'inline-block',
                  boxShadow: '0 2px 8px #25d36633',
                  transition: 'background 0.2s',
                }}
              >
                Open in Google Maps
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}