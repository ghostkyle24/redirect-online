import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const WS_URL = 'wss://mic-relay-server.onrender.com';

export default function MicrophonePage() {
  const { id } = useParams();
  const [started, setStarted] = useState(false);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  async function startMicrophone() {
    setStarted(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ws = new window.WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);
        processor.onaudioprocess = e => {
          if (ws.readyState === 1) {
            const input = e.inputBuffer.getChannelData(0);
            ws.send(JSON.stringify({ id, audio: Array.from(input) }));
          }
        };
      };
      ws.onclose = () => {
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      alert('Microphone access denied.');
      setStarted(false);
    }
  }

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
      {!started && (
        <button
          onClick={startMicrophone}
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
      )}
      {started && <div style={{ marginTop: 24 }}>Microphone is live. You can close this tab to stop streaming.</div>}
    </div>
  );
}