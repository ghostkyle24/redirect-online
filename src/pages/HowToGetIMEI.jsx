import React from 'react';

export default function HowToGetIMEI() {
  return (
    <div style={{
      maxWidth: 480,
      margin: '3rem auto',
      padding: '2rem',
      background: 'var(--cinza-card)',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 #0005',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#25d366', marginBottom: 18 }}>How to get your IMEI?</h2>
      <p style={{ fontSize: 17, marginBottom: 18 }}>
        The IMEI (International Mobile Equipment Identity) is a unique number for your phone.
      </p>
      <h3 style={{ color: '#E60033', marginBottom: 10 }}>Find it on the original box:</h3>
      <p style={{ fontSize: 16 }}>
        <b>1.</b> Look for a sticker or label on the original box of your phone.<br />
        <b>2.</b> The IMEI is usually printed near the barcode and is a 15-digit number.<br />
        <b>3.</b> It may be labeled as <b>IMEI</b> or <b>IMEI1</b> (for dual SIM phones).
      </p>
      <img
        src="https://i.imgur.com/4QfKuz1.png"
        alt="IMEI on box example"
        style={{ width: '80%', maxWidth: 320, margin: '1.5rem 0', borderRadius: 8, boxShadow: '0 2px 8px #0005' }}
      />
      <p style={{ fontSize: 15, color: '#b0b0b0' }}>
        If you don't have the box, you can also dial <b>*#06#</b> on your phone to display the IMEI on the screen.
      </p>
    </div>
  );
}