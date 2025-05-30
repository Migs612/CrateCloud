import { useEffect, useState } from 'react';
import useLastFmAPI from '../../hooks/useLastFmAPI';

const SimilarArtists = ({ artistName, token }) => {
  const [artists, setArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const callLastFm = useLastFmAPI();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [artistName]);

  useEffect(() => {
    const fetchSimilarFromLastFmAndSpotify = async () => {
      if (!artistName || artistName.trim().length < 2 || !token) {
        setErrorMessage('Nombre del artista o token no válido.');
        return;
      }

      try {
        const formattedName = artistName.trim();
        const lastFmData = await callLastFm('artist.getsimilar', {
          artist: formattedName,
          limit: 10,
        });

        const similarArtists = lastFmData?.similarartists?.artist || [];

        const spotifyFetches = similarArtists.map(async (artist) => {
          const query = encodeURIComponent(`artist:${artist.name}`);
          const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          const foundArtist = result.artists?.items?.[0];
          return foundArtist || null;
        });

        const fetched = (await Promise.all(spotifyFetches)).filter(Boolean);
        setArtists(fetched);
      } catch (error) {
        console.error('Error buscando artistas similares desde Last.fm + Spotify:', error);
        setErrorMessage('No se pudieron cargar artistas similares.');
      }
    };

    fetchSimilarFromLastFmAndSpotify();
  }, [artistName, token, callLastFm]);

  const visibleArtists = showMore ? artists : artists.slice(0, 6);

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Artistas similares</h2>

      {errorMessage ? (
        <div className="text-center py-10">
          <div className="text-white/50 mb-2">{errorMessage}</div>
        </div>
      ) : artists.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleArtists.map((artist) => (
              <a
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="cursor-pointer group"
              >
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-800 to-purple-600 aspect-square mb-2 shadow-md">
                  <div className="w-full h-full relative">
                    <img
                      src={artist.images?.[0]?.url || `https://source.unsplash.com/300x300/?music,artist&sig=${artist.id}`}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <i className="ri-play-fill text-xl text-white"></i>
                    </div>
                  </div>
                </div>
                <div className="truncate text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                  {artist.name}
                </div>
              </a>
            ))}
          </div>

          {artists.length > 6 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-sm hover:underline font-medium"
                style={{ color: 'hsl(var(--color-primary-contrast))' }}
              >
                {showMore ? 'Mostrar menos' : 'Ver más'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <div className="text-white/50 mb-2">No se encontraron artistas similares</div>
        </div>
      )}
    </section>
  );
};

export default SimilarArtists;
