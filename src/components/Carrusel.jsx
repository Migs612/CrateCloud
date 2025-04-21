import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSpotifyToken from '../hooks/useSpotifyToken';

const Carrusel = () => {
  const token = useSpotifyToken();
  const [albumes, setAlbumes] = useState([]);

  const rotaciones = ['rotate-[-3deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[3deg]', 'rotate-[1deg]'];
  const desplazamientos = ['-translate-y-1', 'translate-x-1', 'translate-y-1', '-translate-x-1', ''];

  useEffect(() => {
    if (!token) return;

    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/browse/new-releases?limit=9&country=ES',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAlbumes(data.albums.items);
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
            className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 
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