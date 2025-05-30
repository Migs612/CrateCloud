import { Link } from 'react-router-dom'; 

const TopTracks = ({ tracks = [], artistName }) => {
  const formatPlayCount = (count) => {
    if (!count) return '—';
    const num = parseInt(count);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Temas populares</h2>

      {tracks.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-white/50 mb-2">No hay temas disponibles</div>
          <div className="text-sm text-white/30">Prueba con otro artista</div>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {tracks.map((track, index) => {
            const imageUrl = track.album?.images?.[0]?.url || `https://source.unsplash.com/50x50/?music&sig=${index}-${artistName}`;
            const fakePlaycount = Math.floor(Math.random() * 1_000_000);

            return (
              <div
                key={track.id}
                className="flex items-center py-3 hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors group cursor-pointer"
              >
                <div className="w-6 sm:w-8 text-center text-white/50 font-mono text-xs sm:text-sm mr-3">
                  {index + 1}
                </div>

                <Link to={`/album/${track.album.id}`} className="w-10 h-10 mr-3 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={track.album.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm sm:text-base truncate">{track.name}</div>
                  <div className="text-white/60 text-xs sm:text-sm truncate">{artistName}</div>
                </div>

                <div className="text-white/60 text-xs sm:text-sm ml-2 hidden sm:block">
                  {formatPlayCount(fakePlaycount)} <span className="hidden sm:inline">reproducciones</span>
                </div>

                <a
                  href={track.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white/50 hover:text-white opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="ri-play-circle-fill text-lg sm:text-xl"></i>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopTracks;
