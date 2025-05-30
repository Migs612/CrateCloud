import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../hooks/firebase';

const LastfmCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Obtener token de la URL
    const urlParams = new URLSearchParams(location.search);
    const lastfmToken = urlParams.get('token');
    setToken(lastfmToken);

    // Esperar a que Firebase confirme sesión
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, [location.search]);

  useEffect(() => {
    if (!token || !uid) return;

    const conectar = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/lastfm/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, uid }),
        });

        if (res.ok) {
          navigate('/usuario');
        } else {
          console.error('Error al guardar sesión Last.fm');
          navigate('/usuario');
        }
      } catch (err) {
        console.error('Error al conectar Last.fm:', err);
        navigate('/usuario');
      }
    };

    conectar();
  }, [token, uid, navigate]);

  return (
    <div className="text-white text-center py-20 text-lg animate-pulse">
      Conectando con Last.fm...
    </div>
  );
};

export default LastfmCallback;
