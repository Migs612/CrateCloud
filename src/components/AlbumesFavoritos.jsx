import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSpotifyToken from '../hooks/useSpotifyToken';

const AlbumesFavoritos = () => {
  const token = useSpotifyToken();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/browse/new-releases?limit=6&country=GB',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data?.albums?.items) {
          setAlbums(data.albums.items);
        }
      } catch (error) {
        console.error('Error al obtener los álbumes:', error);
      }
    };

    fetchAlbums();
  }, [token]);

  return (
    <div className="mt-4 w-full max-w-6xl mx-auto px-4">
      {/* 📱 Móviles */}
      <div className="block lg:hidden">
        {/* Cabecera con título y botón */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white text-xl font-bold">Álbumes favoritos</div>
          <button className="text-white text-sm border border-white/30 px-3 py-1 rounded hover:bg-white/10 transition">
            Personalizar álbumes
          </button>
        </div>

        {/* Scroll horizontal */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2">
            {albums.map((album, index) => {
              const imagen = album.images?.[0]?.url || 'default-image.jpg';
              return (
                <div
                  key={album.id}
                  className="flex-shrink-0 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-lg overflow-hidden bg-white/20 shadow-md"
                >
                  <Link to={`/album/${album.id}`}>
                    <img
                      src={imagen}
                      alt={album.name}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🖥️ Escritorio */}
      <div className="hidden lg:block">
        <div className="w-fit mx-auto">
          {/* Cabecera con título y botón */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white text-xl font-bold">
              Álbumes favoritos
            </div>
            <button className="text-white text-sm border border-white/30 px-3 py-1 rounded hover:bg-white/10 transition ml-4">
              Personalizar álbumes
            </button>
          </div>

          <div className="flex items-center flex-wrap lg:flex-nowrap gap-0">
            {albums.map((album, index) => {
              const imagen = album.images?.[0]?.url || 'default-image.jpg';
              return (
                <div
                  key={album.id}
                  className={`w-40 h-40 rounded-lg overflow-hidden bg-white/20 shadow-md cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 ${
                    index !== 0 ? 'ml-[-1.5rem]' : ''
                  }`}
                  style={{
                    zIndex: albums.length - index,
                  }}
                >
                  <Link to={`/album/${album.id}`}>
                    <img
                      src={imagen}
                      alt={album.name}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumesFavoritos;
