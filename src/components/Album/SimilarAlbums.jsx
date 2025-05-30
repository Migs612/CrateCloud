import React, { useEffect, useState } from 'react';
import useLastFmAPI from '../../hooks/useLastFmAPI';

const SimilarAlbums = ({ artistName, currentAlbumId, token }) => {
  const callLastFm = useLastFmAPI();
  const [albums, setAlbums] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!artistName || !token) return;

    const fetchFromLastFmAndSpotify = async () => {
      try {
        const data = await callLastFm('artist.getsimilar', { artist: artistName, limit: 8 });
        const similarArtists = data?.similarartists?.artist || [];

        if (similarArtists.length === 0) return;

        const spotifyFetches = similarArtists.map(async (artist) => {
          const query = encodeURIComponent(`artist:${artist.name}`);
          const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          const album = result.albums?.items?.[0];
          return album && album.id !== currentAlbumId ? album : null;
        });

        const fetchedAlbums = (await Promise.all(spotifyFetches)).filter(Boolean);
        setAlbums(fetchedAlbums.slice(0, 8));
      } catch (err) {
        console.error('Error buscando álbumes similares con Last.fm + Spotify:', err);
      }
    };

    fetchFromLastFmAndSpotify();
  }, [artistName, currentAlbumId, token, callLastFm]);

  const visibleAlbums = showMore ? albums : albums.slice(0, 4);

  if (albums.length === 0) {
    return <p className="text-white/50">No se encontraron álbumes similares.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleAlbums.map((album) => (
          <a
            key={album.id}
            href={`/album/${album.id}`}
            className="group cursor-pointer album-card"
          >
            <div className="relative overflow-hidden mb-2 rounded-md">
              <img
                src={album.images?.[0]?.url}
                alt={album.name}
                className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <i className="ri-play-fill text-black text-xl"></i>
                </button>
              </div>
            </div>
            <h3 className="font-medium text-white text-sm">{album.name}</h3>
            <p className="text-white/60 text-xs">{album.artists?.[0]?.name}</p>
          </a>
        ))}
      </div>
      {albums.length > 4 && (
        <div className="text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm hover:underline font-medium"
            style={{ color: 'hsl(var(--color-primary-contrast))' }}
          >
            {showMore ? 'Mostrar menos' : 'Ver más'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilarAlbums;
