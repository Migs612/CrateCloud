import { useEffect, useState } from 'react';

const useSpotifyAppToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/spotify/token');
        if (!res.ok) throw new Error('Error al obtener token de Spotify');
        const data = await res.json();
        setToken(data.access_token);
      } catch (error) {
        console.error('Error en useSpotifyAppToken:', error);
        // Reintentar después de un pequeño delay si falla al cargar
        setTimeout(getToken, 1000); // <-- esto reintenta a los 1s si falla
      }
    };

    getToken();
  }, []);

  return token;
};

export default useSpotifyAppToken;
