import { useState, useEffect } from 'react';
import FollowButton from '../Global/FollowButton';

const ArtistHeader = ({ id, name, imageUrl, followers, genres = [] }) => {
  const [formattedFollowers, setFormattedFollowers] = useState('');

  useEffect(() => {
    if (followers) {
      setFormattedFollowers(parseInt(followers).toLocaleString());
    }
  }, [followers]);

  const finalImageUrl = imageUrl || `https://source.unsplash.com/featured/?concert,music,${encodeURIComponent(name)}`;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height: '28rem' }}
    >
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${finalImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          zIndex: 0,
          borderRadius: '1rem',
          height: '100%',
        }}
      />

      {/* Overlay de color */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"
        style={{ zIndex: 1, borderRadius: '1rem', height: '100%' }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end p-4 sm:p-6 md:p-8 h-full">
        <div className="relative mb-3 md:mb-0 md:mr-6">
          <div
            className="rounded-full overflow-hidden shadow-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm"
            style={{ width: '6rem', height: '6rem' }}
          >
            <img
              src={finalImageUrl}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="flex-1 max-w-full text-white">
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-unbounded leading-tight break-words truncate">
              {name}
            </h1>
            <FollowButton targetId={id} targetType="artist" />
          </div>

          <div
            className="mb-3 inline-flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg"
            style={{
              background: 'hsl(var(--color-primary-dark) / 0.7)',
              color: 'hsl(var(--color-primary-contrast))',
            }}
          >
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 text-white/80">
            <div className="flex items-center">
              <i className="ri-user-heart-line mr-1"></i>
              <span>
                <span className="font-bold">{formattedFollowers || 'No disponible'}</span> seguidores
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
