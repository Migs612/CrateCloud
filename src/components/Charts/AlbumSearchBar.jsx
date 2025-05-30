import React, { useState, useEffect } from 'react';
import useSpotifyAppToken from '../../hooks/useSpotifyAppToken';

const AlbumSearchBar = ({ onSelect }) => {
  const token = useSpotifyAppToken();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]); // ✅ Limpiar si no hay texto
      return;
    }

    const delay = setTimeout(async () => {
      if (!token) return;

      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        const items = data.albums?.items || [];

        const formatted = items.map((album) => ({
          title: album.name,
          artist: album.artists.map((a) => a.name).join(', '),
          cover: album.images?.[0]?.url || '',
          id: album.id,
        }));

        setResults(formatted);
      } catch (e) {
        console.error('Error buscando álbumes en Spotify:', e);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query, token]);

  return (
    <div>
      <input
        className="w-full bg-transparent border border-white/30 text-white placeholder-white/60 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        type="text"
        placeholder="Buscar álbum en Spotify..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="grid gap-2 max-h-[320px] overflow-y-auto custom-scrollbar">
          {results.map((album) => (
            <button
              key={album.id}
              className="flex items-center bg-white/10 hover:bg-white/20 p-2 rounded transition text-left"
              onClick={() => onSelect(album)}
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-12 h-12 object-cover rounded mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-white">{album.title}</p>
                <p className="text-xs text-white/60">{album.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumSearchBar;
