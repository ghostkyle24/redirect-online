import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const WS_URL = 'wss://mic-relay-server.onrender.com';

export default function MicrophonePage() {
  const { id } = useParams();
  const [started, setStarted] = useState(false);
  const [logs, setLogs] = useState([]);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  function addLog(msg) {
    setLogs(l => [...l, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  async function startMicrophone() {
    setStarted(true);
    try {
      addLog('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('Permission granted, stream: ' + stream.id);
      streamRef.current = stream;
      const ws = new window.WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        addLog('WebSocket opened: ' + WS_URL);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);
        processor.onaudioprocess = e => {
          if (ws.readyState === 1) {
            const input = e.inputBuffer.getChannelData(0);
            ws.send(JSON.stringify({ id, audio: Array.from(input) }));
            addLog('Sending audio: ' + input.slice(0, 5).join(',') + '... len=' + input.length);
          }
        };
        addLog('AudioContext, source and processor created');
      };
      ws.onclose = () => {
        addLog('WebSocket closed');
        stream.getTracks().forEach(track => track.stop());
      };
      ws.onerror = (err) => {
        addLog('WebSocket error: ' + err.message);
      };
    } catch (err) {
      alert('Microphone access denied.');
      setStarted(false);
      addLog('Error accessing microphone: ' + err.message);
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
      <div style={{
        marginTop: 32,
        background: '#222',
        color: '#fff',
        borderRadius: 8,
        padding: 16,
        maxWidth: 400,
        width: '90vw',
        fontSize: 13,
        textAlign: 'left'
      }}>
        <b>Debug log:</b>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 8 }}>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>
    </div>
  );
}