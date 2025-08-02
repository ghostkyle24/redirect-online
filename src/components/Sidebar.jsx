import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBook, FaWhatsapp, FaInstagram, FaFacebookF, FaMicrophone, FaBars } from 'react-icons/fa';
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
        </ul>
      </nav>
      <button className="sidebar__toggle" onClick={() => setOpen(!open)}>
        <FaBook size={24} />
      </button>
    </>
  );
}