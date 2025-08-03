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
      textAlign: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <h2 style={{ color: '#25d366', marginBottom: 18, fontWeight: 800, fontSize: 28 }}>How to find your IMEI using the original phone box</h2>
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
        <b style={{ color: '#25d366', fontSize: 19 }}>Step-by-step:</b>
        <ol style={{ margin: '1rem 0 0 1.2rem', padding: 0, color: '#fff', fontSize: 16 }}>
          <li style={{ marginBottom: 10 }}>
            <b>Find the original box</b> of your phone (the one it came in when you bought it).
          </li>
          <li style={{ marginBottom: 10 }}>
            <b>Look for a sticker or label</b> on the outside of the box. It is usually on the bottom or one of the sides.
          </li>
          <li style={{ marginBottom: 10 }}>
            <b>Locate the IMEI number</b> on the label. It is a 15-digit number, often printed near the barcode and may be labeled as <b>IMEI</b>, <b>IMEI1</b> or <b>IMEI2</b> (for dual SIM phones).
          </li>
          <li style={{ marginBottom: 10 }}>
            <b>Write down or take a photo</b> of the IMEI for your records.
          </li>
        </ol>
      </div>
      <img
        src="https://i.imgur.com/4QfKuz1.png"
        alt="IMEI on box example"
        style={{ width: '90%', maxWidth: 340, margin: '1.5rem 0', borderRadius: 8, boxShadow: '0 2px 8px #0005', border: '2px solid #25d366' }}
      />
      <div style={{
        background: 'rgba(36, 36, 36, 0.7)',
        borderRadius: 8,
        padding: '1rem',
        marginTop: 18,
        color: '#b0b0b0',
        fontSize: 15,
      }}>
        <b>Tip:</b> If you don't have the box, you can also dial <b>*#06#</b> on your phone to display the IMEI on the screen.
      </div>
    </div>
  );
}