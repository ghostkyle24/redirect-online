import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBook, FaWhatsapp, FaInstagram, FaFacebookF, FaMicrophone, FaBars, FaHome, FaQuestionCircle, FaLifeRing } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const pathMap = {
  'Home': '/',
  'Lessons': '/',
  'Spy Location': '/spy-location',
  'WhatsApp': '/whatsapp',
  'Instagram': '/instagram',
  'Facebook': '/facebook',
  'Microphone': '/microphone',
  'FAQ': '/faq',
  'Support and refund': '/support',
};

export default function Sidebar({ active = 'Home', items }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
              className={`sidebar__item${location.pathname === pathMap[item.label] ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Link to={pathMap[item.label]} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none', width: '100%' }}>
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className="sidebar__toggle" onClick={() => setOpen(!open)} style={{ background: '#232d36', color: '#E60033', border: 'none', boxShadow: '0 2px 8px #E6003340', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'box-shadow 0.2s, background 0.2s', fontSize: 28, cursor: 'pointer' }}>
        <FaBars size={28} color="#E60033" />
      </button>
    </>
  );
}