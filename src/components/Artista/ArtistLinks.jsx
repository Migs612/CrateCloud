import React from 'react';

const ArtistLinks = ({ url, name, ontour = false }) => {
  const socialLinks = [
    {
      name: 'YouTube Music',
      icon: 'ri-youtube-fill',
      url: `https://music.youtube.com/search?q=${encodeURIComponent(name)}`
    },
    {
      name: 'Apple Music',
      icon: 'ri-apple-fill',
      url: `https://music.apple.com/us/search?term=${encodeURIComponent(name)}`
    },
    {
      name: 'Instagram',
      icon: 'ri-instagram-line',
      url: `https://www.instagram.com/${name.toLowerCase().replace(/\s+/g, '')}`
    }
  ];

  return (
    <>
      <div className="glass rounded-xl p-5 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Enlaces</h3>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 rounded-lg transition-colors mb-3"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-[#1DB954] text-white rounded-full flex-shrink-0">
              <i className="ri-spotify-fill"></i>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Spotify</div>
              <div className="text-white/50 text-xs truncate">Perfil oficial</div>
            </div>
            <i className="ri-external-link-line text-white/50"></i>
          </a>
        )}

        <a
          href={`https://www.last.fm/music/${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-[#d51007]/20 hover:bg-[#d51007]/30 rounded-lg transition-colors mb-3"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-[#d51007] text-white rounded-full flex-shrink-0">
            <i className="ri-lastfm-fill"></i>
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Last.fm</div>
            <div className="text-white/50 text-xs truncate">Perfil oficial</div>
          </div>
          <i className="ri-external-link-line text-white/50"></i>
        </a>

        <div className="space-y-2 mt-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <i className={`${link.icon} text-lg`}></i>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className={`glass rounded-xl p-5 mb-6 ${ontour ? 'border border-green-500/30' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            ontour ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
          }`}>
            <i className="ri-mic-fill text-xl"></i>
          </div>
          <div>
            <div className="font-bold text-white">Estado de gira</div>
            <div className={ontour ? 'text-green-400' : 'text-white/50'}>
              {ontour ? 'Actualmente en gira' : 'No hay giras programadas'}
            </div>
          </div>
        </div>

        {ontour && (
          <button className="w-full mt-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg transition-colors">
            Ver conciertos
          </button>
        )}
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">Compartir</h3>
        <div className="flex justify-between">
          {['ri-twitter-x-line', 'ri-facebook-fill', 'ri-whatsapp-line', 'ri-telegram-line', 'ri-link'].map((icon, index) => (
            <button
              key={index}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <i className={icon}></i>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArtistLinks;
