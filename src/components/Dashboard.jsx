import React, { useState } from 'react';
import Header from './Header';
import LinkGenerator from './LinkGenerator';
import LinksList from './LinksList';
import Sidebar from './Sidebar';

export default function Dashboard({ email }) {
  const [active, setActive] = useState('Spy Location');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--preto-espionagem)' }}>
      <Sidebar active={active} onSelect={setActive} />
      <div style={{
        flex: 1,
        marginLeft: 220,
        padding: '2.5rem 1rem 1.5rem 1rem',
        maxWidth: 900,
        width: '100%',
        marginRight: 'auto',
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <Header />
        <div style={{ width: '100%', maxWidth: 600 }}>
          <h2 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', marginBottom: 8 }}>Secret Dashboard</h2>
          <p style={{ textAlign: 'center', color: 'var(--cinza-conspiracao)', marginBottom: 32 }}>Welcome, <b>{email}</b>!</p>
          {(active === 'Spy Location' || active === 'Facebook') && (
            <LinkGenerator />
          )}
          {active === 'Spy Location' && <LinksList />}
          {active !== 'Spy Location' && active !== 'Facebook' && (
            <div style={{
              background: 'var(--fundo-destaque)',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(76,76,76,0.12)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              color: 'var(--cinza-conspiracao)',
              fontSize: 20,
              marginTop: 32
            }}>
              <b>{active}</b> coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}