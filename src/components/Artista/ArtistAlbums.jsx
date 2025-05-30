import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ArtistAlbums = ({ albums = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const formatPlayCount = (count) => {
    if (!count) return "0";
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const displayedAlbums = showAll ? albums : albums.slice(0, 3);

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Álbumes</h2>

      {albums.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-white/50 mb-2">No se encontraron álbumes</div>
          <p className="text-white/30 text-sm">Prueba con otro artista o verifica el nombre</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {displayedAlbums.map((album, index) => {
            const imageUrl = album.images?.[0]?.url || `https://source.unsplash.com/300x300/?album,vinyl&sig=${album.name}`;
            const fakePlaycount = Math.floor(Math.random() * 1000000);

            return (
              <div key={album.id || index} className="group">
                <Link to={`/album/${album.id}`}>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-800 to-purple-600 relative">
                    <img
                      src={imageUrl}
                      alt={album.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                      <div></div>
                      <div>
                        <div className="text-white font-medium text-sm md:text-base truncate">{album.name}</div>
                        <div className="text-white/60 text-xs sm:text-sm flex items-center mt-1">
                          <i className="ri-play-fill mr-1"></i>
                          <span>{formatPlayCount(fakePlaycount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-2">
                  <Link
                    to={`/album/${album.id}`}
                    className="text-white font-medium text-sm md:text-base truncate hover:underline"
                  >
                    {album.name}
                  </Link>
                  {album.artists?.[0] && (
                    <p className="text-white/60 text-xs sm:text-sm truncate">{album.artists[0].name}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {albums.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white/10 hover:bg-white/15 text-white py-2 px-6 rounded-full transition-colors text-sm"
          >
            {showAll ? 'Ver menos' : 'Ver más álbumes'}
          </button>
        </div>
      )}
    </section>
  );
};

export default ArtistAlbums;
