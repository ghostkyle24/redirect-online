import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBook, FaWhatsapp, FaInstagram, FaFacebookF, FaMicrophone, FaBars, FaHome, FaQuestionCircle, FaLifeRing } from 'react-icons/fa';
import './Sidebar.css';

const items = [
  { label: 'Spy Location', icon: <FaMapMarkerAlt />, path: '#' },
  { label: 'WhatsApp', icon: <FaWhatsapp />, path: '#' },
  { label: 'Instagram', icon: <FaInstagram />, path: '#' },
  { label: 'Facebook', icon: <FaFacebookF />, path: '#' },
  { label: 'Real-time Microphone', icon: <FaMicrophone />, path: '#' },
];

export default function Sidebar({ active = 'Home', onSelect, items }) {
  const [open, setOpen] = useState(false);

  function handleSelect(label) {
    if (onSelect) onSelect(label);
    setOpen(false);
  }

  return (
    <>
      <div className={`sidebar-backdrop${open ? ' show' : ''}`} onClick={() => setOpen(false)} />
      <nav className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar__logo">
          <img src={process.env.PUBLIC_URL + '/signalchecklogo.png'} alt="Logo" height={36} />
          <span>SignalCheck</span>
        </div>
        <ul className="sidebar__list">
          {items.map(item => (
            <li
              key={item.label}
              className={`sidebar__item${active === item.label ? ' active' : ''}`}
              onClick={() => handleSelect(item.label)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__text">{item.label}</span>
            </li>
          ))}
          <li className="sidebar__item" onClick={() => handleSelect('FAQ')}>
            <span className="sidebar__icon"><FaQuestionCircle size={22} /></span>
            <span className="sidebar__text">FAQ</span>
          </li>
          <li className="sidebar__item" onClick={() => handleSelect('Support')}>
            <span className="sidebar__icon"><FaLifeRing size={22} /></span>
            <span className="sidebar__text">Support</span>
          </li>
        </ul>
      </nav>
      <button className="sidebar__toggle" onClick={() => setOpen(!open)} style={{ background: '#232d36', color: '#E60033', border: 'none', boxShadow: '0 2px 8px #E6003340', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 28, cursor: 'pointer' }}>
        <FaBars size={28} color="#E60033" />
      </button>
    </>
  );
}