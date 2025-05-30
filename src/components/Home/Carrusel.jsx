import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSpotifyAppToken from '../../hooks/useSpotifyAppToken';

const Carrusel = () => {
  const token = useSpotifyAppToken();
  const [albumes, setAlbumes] = useState([]);

  const rotaciones = ['rotate-[-3deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[1deg]'];
  const desplazamientos = ['-translate-y-1', 'translate-x-1', 'translate-y-1', '-translate-x-1', ''];

  useEffect(() => {
    if (!token) return;

    const albumIds = [
      '3RQQmkQEvNCY4prGKE6oc5', // Un Verano Sin Ti - Bad Bunny
      '7gsWAHLeT0w7es6FofOXk1', // The life of Pablo - Kanye West
      '3T4tUhGYeRNVUGevb0wThu', // ÷ (Divide) - Ed Sheeran
      '6s84u2TUpR3wdUv4NgKA2j', // SOUR - Olivia Rodrigo
      '4yP0hdKOZPNshxUOjY0cZj', // After Hours - The Weeknd
      '6trNtQUgC8cgbWcqoMYkOR', // Hollywood's Bleeding - Post Malone
      '5lKlFlReHOLShQKyRv6AL9', // Future Nostalgia - Dua Lipa
      '6PWXKiakqhI17mTYM4y6oY', // Dua Lipa - Dua Lipa
      '7fRrTyKvE4Skh93v97gtcU', // SOS - SZA
    ];

    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums?ids=${albumIds.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAlbumes(data.albums);
      } catch (error) {
        console.error('Error al obtener álbumes:', error);
      }
    };

    fetchAlbums();
  }, [token]);

  return (
    <div className="grid grid-cols-3 grid-rows-3 w-fit mx-auto relative -space-x-4 -space-y-4">
      {albumes.map((album, index) => {
        const estiloExtra = `${rotaciones[index % rotaciones.length]} ${desplazamientos[index % desplazamientos.length]}`;
        const imagen = album.images[0]?.url;

        return (
          <div
            key={album.id}
            className={`w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 
            ${estiloExtra} hover:scale-[1.2] hover:z-50 relative z-0`}
          >
            {imagen ? (
              <Link to={`/album/${album.id}`}>
                <img
                  src={imagen}
                  alt={album.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </Link>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-white">
                Sin imagen
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Carrusel;