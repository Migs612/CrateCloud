import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const uid = urlParams.get('state'); // el uid lo mandamos en state

    const sendCode = async () => {
      try {
        await fetch('http://localhost:4000/api/spotify/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, uid }),
        });

        navigate('/usuario');
      } catch (error) {
        console.error('Error al conectar con Spotify:', error);
        navigate('/usuario');
      }
    };

    if (code && uid) sendCode();
  }, [location, navigate]);

  return (
    <div className="text-white p-6 text-center">
      Conectando con Spotify...
    </div>
  );
};

export default SpotifyCallback;
