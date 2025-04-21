// src/components/AlbumesFavoritos.jsx
import React, { useEffect, useState } from 'react';
import useSpotifyToken from '../hooks/useSpotifyToken';

const AlbumesFavoritos = () => {
  const token = useSpotifyToken();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/browse/new-releases?limit=6&country=ES',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        
        if (data && data.albums && data.albums.items) {
          setAlbums(data.albums.items); // Asignamos los álbumes aleatorios
        }
      } catch (error) {
        console.error('Error al obtener los álbumes:', error);
      }
    };

    fetchAlbums();
  }, [token]);

  return (
    <div className="mt-4">
      <div className="flex space-x-3 justify-center">
        {albums.map((album) => {
          const imagen = album.images && album.images.length > 0 ? album.images[0].url : 'default-image.jpg';
          return (
            <div
              key={album.id}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-white/20 shadow-md cursor-pointer relative hover:scale-110 transition-all duration-300"
            >
              <img
                src={imagen}
                alt={album.name}
                className="object-cover w-full h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumesFavoritos;
