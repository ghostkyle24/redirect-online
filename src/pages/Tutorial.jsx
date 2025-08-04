import React, { useState, useEffect } from 'react';

const videos = [
  'https://www.youtube.com/embed/X30N6ybuju4',
  'https://www.youtube.com/embed/vma9TIytHHo',
  'https://www.youtube.com/embed/VJFKb2i-9j8',
];

function getCurrentDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB');
}

export default function Tutorial() {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const ip = window?.location?.hostname || '127.0.0.1';

  useEffect(() => {
    setShowButton(false);
    let timeout;
    if (step === 0) timeout = setTimeout(() => setShowButton(true), 15000);
    else if (step === 1 || step === 2) timeout = setTimeout(() => setShowButton(true), 20000);
    return () => clearTimeout(timeout);
  }, [step]);

  function handleAccept() {
    setAccepted(true);
  }

  function handleNext() {
    if (step < videos.length - 1) {
      setStep(step + 1);
    } else {
      window.location.href = 'https://redirect-online.vercel.app/';
    }
  }

  if (!accepted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#181A1B',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '2rem'
      }}>
        <h2 style={{ color: '#E60033', marginBottom: 24 }}>Responsibility Agreement</h2>
        <div style={{
          background: 'rgba(230,0,51,0.08)',
          borderRadius: 10,
          padding: '1.5rem',
          maxWidth: 480,
          color: '#fff',
          fontSize: 17,
          marginBottom: 24,
          boxShadow: '0 2px 8px #E6003322'
        }}>
          <p>
            After accepting the terms, I declare that:
            <ul style={{ margin: '1rem 0 1rem 1.2rem' }}>
              <li>I am aware that the application [App Name] must be used only on devices I own or with the express authorization of the owner;</li>
              <li>I take full responsibility for the use of the tool;</li>
              <li>I understand that misuse may constitute a legal violation under current legislation (including LGPD, Penal Code, and other applicable rules);</li>
              <li>I exempt the developer company from any legal liability arising from misuse or unauthorized use.</li>
            </ul>
            I also declare that I have read and accepted the Terms of Use and Privacy Policy.
          </p>
          <div style={{ margin: '1.2rem 0', color: '#b0b0b0', fontSize: 15 }}>
            <b>Electronic signature / IP:</b> {ip}<br />
            <b>Date:</b> {getCurrentDate()}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', fontSize: 16 }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              style={{ marginRight: 10, width: 18, height: 18 }}
            />
            I have read and accept the terms above.
          </label>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            style={{
              background: accepted ? '#25d366' : '#888',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.7rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: accepted ? 'pointer' : 'not-allowed',
              marginTop: 16,
              minWidth: 160
            }}
          >
            Accept and continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#181A1B',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '2rem'
    }}>
      <h2 style={{ color: '#25d366', marginBottom: 24, textAlign: 'center', fontSize: 22 }}>
        Before accessing the tool, watch this quick video to learn how to use it.
      </h2>
      <div style={{ width: '100%', maxWidth: 350, marginBottom: 32 }}>
        <iframe
          width="100%"
          height="520"
          src={videos[step]}
          title={`Tutorial step ${step + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 12, boxShadow: '0 2px 8px #0005', width: '100%', maxWidth: 350, height: 520 }}
        ></iframe>
      </div>
      {showButton && (
        <button
          onClick={handleNext}
          style={{
            background: '#25d366',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 1.7rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 16,
            minWidth: 160
          }}
        >
          Understood!
        </button>
      )}
    </div>
  );
}