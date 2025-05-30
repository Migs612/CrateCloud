import React, { useState } from 'react';

const PersonalizeScreen = ({ onComplete, spotifyProfile }) => {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [searchArtist, setSearchArtist] = useState('');
  const [searchAlbum, setSearchAlbum] = useState('');

  // Sugerencias basadas en artistas populares (en una implementación real vendrían de Spotify)
  const suggestedArtists = [
    { id: 1, name: 'Taylor Swift', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png' },
    { id: 2, name: 'The Weeknd', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/1c4b15eb3fdc4a2db4c05d1c6fd86521.jpg' },
    { id: 3, name: 'Billie Eilish', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/34e2a8c773b5e566ebfcae85b81f231d.jpg' },
    { id: 4, name: 'Bad Bunny', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/5875caa11b0d8f9cb62b93fa3531ff36.jpg' },
    { id: 5, name: 'Dua Lipa', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/32e8c1cf1bf9cf5afb1d22d3fb1eef9e.jpg' },
    { id: 6, name: 'Drake', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/c97e54e133791cd4e32c9312fdde65da.jpg' }
  ];

  const suggestedAlbums = [
    { id: 1, title: 'Midnights', artist: 'Taylor Swift', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png' },
    { id: 2, title: 'After Hours', artist: 'The Weeknd', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/1c4b15eb3fdc4a2db4c05d1c6fd86521.jpg' },
    { id: 3, title: 'Happier Than Ever', artist: 'Billie Eilish', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/34e2a8c773b5e566ebfcae85b81f231d.jpg' },
    { id: 4, title: 'Un Verano Sin Ti', artist: 'Bad Bunny', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/5875caa11b0d8f9cb62b93fa3531ff36.jpg' },
    { id: 5, title: 'Future Nostalgia', artist: 'Dua Lipa', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/32e8c1cf1bf9cf5afb1d22d3fb1eef9e.jpg' },
    { id: 6, title: 'Scorpion', artist: 'Drake', image: 'https://lastfm.freetls.fastly.net/i/u/300x300/c97e54e133791cd4e32c9312fdde65da.jpg' }
  ];

  const addArtist = (artist) => {
    if (selectedArtists.length < 3 && !selectedArtists.find(a => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const addAlbum = (album) => {
    if (selectedAlbums.length < 3 && !selectedAlbums.find(a => a.id === album.id)) {
      setSelectedAlbums([...selectedAlbums, album]);
    }
  };

  const removeArtist = (artistId) => {
    setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
  };

  const removeAlbum = (albumId) => {
    setSelectedAlbums(selectedAlbums.filter(a => a.id !== albumId));
  };

  const handleContinue = () => {
    if (selectedArtists.length === 3 && selectedAlbums.length === 3) {
      onComplete(selectedArtists, selectedAlbums);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 text-center relative">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full filter blur-[120px] opacity-20" style={{ backgroundColor: '#4ecdc4' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <i className="ri-sparkling-2-line text-2xl sm:text-3xl md:text-4xl text-yellow-400"></i>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight">
              Cuéntanos quién eres con tu música
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Elige tus 3 artistas y 3 álbumes favoritos. Esto nos ayuda a construir tu crate personal y darte mejores recomendaciones.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Sección Artistas */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <i className="ri-mic-fill text-white text-lg sm:text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Artistas favoritos</h2>
                <p className="text-sm sm:text-base text-gray-400">Selecciona 3 artistas ({selectedArtists.length}/3)</p>
              </div>
            </div>

            {/* Artistas seleccionados */}
            {selectedArtists.length > 0 && (
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {selectedArtists.map((artist, index) => (
                  <div key={artist.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-purple-400 font-bold text-base sm:text-lg">{index + 1}</span>
                    <img src={artist.image} alt={artist.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
                    <span className="text-white font-medium flex-1 text-sm sm:text-base truncate">{artist.name}</span>
                    <button
                      onClick={() => removeArtist(artist.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                      <i className="ri-close-line text-red-400 text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Búsqueda de artistas */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar artistas..."
                value={searchArtist}
                onChange={(e) => setSearchArtist(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 text-sm sm:text-base"
              />
              <i className="ri-search-line absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Sugerencias de artistas */}
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3">Basado en tus más escuchados:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestedArtists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => addArtist(artist)}
                    disabled={selectedArtists.length >= 3 || selectedArtists.find(a => a.id === artist.id)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <img src={artist.image} alt={artist.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
                    <span className="text-white text-xs sm:text-sm font-medium truncate">{artist.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Álbumes */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <i className="ri-album-fill text-white text-lg sm:text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Álbumes favoritos</h2>
                <p className="text-sm sm:text-base text-gray-400">Selecciona 3 álbumes ({selectedAlbums.length}/3)</p>
              </div>
            </div>

            {/* Álbumes seleccionados */}
            {selectedAlbums.length > 0 && (
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {selectedAlbums.map((album, index) => (
                  <div key={album.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-blue-400 font-bold text-base sm:text-lg">{index + 1}</span>
                    <img src={album.image} alt={album.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{album.title}</p>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{album.artist}</p>
                    </div>
                    <button
                      onClick={() => removeAlbum(album.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                      <i className="ri-close-line text-red-400 text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Búsqueda de álbumes */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar álbumes..."
                value={searchAlbum}
                onChange={(e) => setSearchAlbum(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm sm:text-base"
              />
              <i className="ri-search-line absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Sugerencias de álbumes */}
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3">Álbumes populares:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestedAlbums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => addAlbum(album)}
                    disabled={selectedAlbums.length >= 3 || selectedAlbums.find(a => a.id === album.id)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <img src={album.image} alt={album.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{album.title}</p>
                      <p className="text-gray-400 text-xs truncate">{album.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip info */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2 sm:gap-3">
            <i className="ri-information-line text-blue-400 text-lg sm:text-xl mt-1"></i>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1 text-sm sm:text-base">¿Por qué esto importa?</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Para personalizar tu crate, descubrir nuevos artistas y conectar con otros usuarios afines.</p>
            </div>
          </div>
        </div>

        {/* Botón continuar */}
        <div className="flex justify-center mt-8 sm:mt-12 px-4">
          <button
            onClick={handleContinue}
            disabled={selectedArtists.length !== 3 || selectedAlbums.length !== 3}
            className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl text-white font-bold text-base sm:text-lg md:text-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
            style={{
              background: selectedArtists.length === 3 && selectedAlbums.length === 3 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : 'linear-gradient(135deg, #374151, #4b5563)',
              boxShadow: selectedArtists.length === 3 && selectedAlbums.length === 3 
                ? '0 20px 40px rgba(16, 185, 129, 0.4)' 
                : '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="relative flex items-center justify-center gap-3 sm:gap-4">
              <i className="ri-magic-line text-2xl sm:text-3xl"></i>
              <span>Crear mi crate</span>
              <i className="ri-arrow-right-line text-xl sm:text-2xl group-hover:translate-x-2 transition-transform duration-300"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeScreen;