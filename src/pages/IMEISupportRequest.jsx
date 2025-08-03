import React, { useState } from 'react';

export default function IMEISupportRequest() {
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    // Aqui você pode adicionar lógica para enviar para um backend ou serviço de suporte
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '3rem auto',
      padding: '2rem',
      background: 'var(--cinza-card)',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 #0005',
      color: '#fff',
      textAlign: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <h2 style={{ color: '#E60033', marginBottom: 18, fontWeight: 800, fontSize: 26 }}>
        Attention: IMEI Request via Support
      </h2>
      <div style={{
        background: 'rgba(230,0,51,0.08)',
        borderRadius: 10,
        padding: '1.2rem',
        margin: '1.5rem 0',
        boxShadow: '0 2px 8px #E6003322',
        textAlign: 'left',
        color: '#fff',
        fontSize: 17,
      }}>
        <p>
          <b>If you do not have direct access to the target device's IMEI, our team can obtain this data for you upon formal request.</b>
        </p>
        <p>
          Please open a support ticket using the form below and let us know why you could not get the IMEI of the target device. The process takes 7 to 10 business days, depending on the availability of our data sources. Meanwhile, all other features of the tool will remain available for normal use.
        </p>
        <b style={{ color: '#25d366', fontSize: 17 }}>Required information:</b>
        <ul style={{ margin: '1rem 0 0 1.2rem', padding: 0, color: '#fff', fontSize: 16 }}>
          <li>Phone number associated with the device</li>
          <li>Device model and version (e.g., Samsung Galaxy A52 – Android 13)</li>
          <li>Contact email for updates</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <input
          type="text"
          placeholder="Phone number (e.g. +15551234567)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #b0b0b0',
            marginBottom: 12,
            fontSize: 16,
            background: '#181A1B',
            color: '#fff'
          }}
        />
        <input
          type="text"
          placeholder="Device model and version (e.g. Samsung Galaxy A52 – Android 13)"
          value={model}
          onChange={e => setModel(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #b0b0b0',
            marginBottom: 12,
            fontSize: 16,
            background: '#181A1B',
            color: '#fff'
          }}
        />
        <input
          type="email"
          placeholder="Contact email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #b0b0b0',
            marginBottom: 18,
            fontSize: 16,
            background: '#181A1B',
            color: '#fff'
          }}
        />
        <button
          type="submit"
          style={{
            background: '#25d366',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 1.7rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            marginBottom: 10
          }}
        >
          Submit IMEI Request
        </button>
      </form>
      {sent && (
        <div style={{ color: '#25d366', marginTop: 18, fontWeight: 600, fontSize: 17 }}>
          Request sent. You will have access to the device's WhatsApp within 7 business days.
        </div>
      )}
    </div>
  );
}