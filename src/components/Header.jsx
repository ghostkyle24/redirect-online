import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={process.env.PUBLIC_URL + '/signalchecklogo.png'} alt="SignalCheck Logo" height={40} />
        <span className="header__brand">SignalCheck</span>
      </div>
    </header>
  );
}