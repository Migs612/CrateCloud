import React, { useEffect, useState } from 'react';
import { auth } from '../../hooks/firebase';

const Estadisticas = () => {
  const [playcount, setPlaycount] = useState(0);
  const [topArtist, setTopArtist] = useState(null);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/${uid}`);
        const user = await res.json();

        setFollowers(user.followers?.length || 0);

        if (user.lastfm?.connected) {
          const userName = user.lastfm.username;
          const apiKey = process.env.REACT_APP_LASTFM_API_KEY;

          const infoRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${userName}&api_key=${apiKey}&format=json`);
          const infoData = await infoRes.json();
          setPlaycount(infoData.user?.playcount || 0);

          const topRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${userName}&api_key=${apiKey}&format=json&limit=1`);
          const topData = await topRes.json();
          setTopArtist(topData.topartists?.artist?.[0]?.name || null);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white bg-white/5 p-4 rounded-lg w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-4">Estadísticas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-semibold">{playcount}</p>
          <p className="text-sm text-white/70">Spins</p>
        </div>
        <div>
          <p className="text-lg font-semibold truncate">{topArtist || 'Sin datos'}</p>
          <p className="text-sm text-white/70">Artista más escuchado</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">{followers}</p>
          <p className="text-sm text-white/70">Seguidores</p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
