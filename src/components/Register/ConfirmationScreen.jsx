import React from 'react';

const ConfirmationScreen = ({ userData, onComplete }) => {
  const { favoriteArtists, favoriteAlbums, spotifyProfile } = userData;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Efectos de fondo celebratorios */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full filter blur-[100px] opacity-30" style={{ backgroundColor: '#10b981' }} />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full filter blur-[120px] opacity-25" style={{ backgroundColor: '#8b5cf6' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full filter blur-[80px] opacity-20" style={{ backgroundColor: '#f59e0b' }} />
        
        {/* Partículas de celebración */}
        <div className="absolute top-1/4 left-1/6 animate-bounce">
          <i className="ri-music-2-fill text-yellow-400/30 text-4xl"></i>
        </div>
        <div className="absolute bottom-1/4 right-1/6 animate-bounce delay-300">
          <i className="ri-headphone-fill text-green-400/30 text-5xl"></i>
        </div>
        <div className="absolute top-1/3 right-1/5 animate-bounce delay-700">
          <i className="ri-disc-fill text-purple-400/30 text-3xl"></i>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl text-center w-full">
          {/* Mensaje de celebración */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <i className="ri-sparkling-2-fill text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 animate-pulse"></i>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center leading-tight">
                ¡Tu crate base está listo!
              </h1>
              <i className="ri-sparkling-2-fill text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 animate-pulse"></i>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Hemos creado tu colección personal basada en tus gustos musicales. ¡Es hora de descubrir más música increíble!
            </p>
          </div>

          {/* Vista previa del crate */}
          <div className="mb-8 sm:mb-12 px-4">
            <div 
              className="relative max-w-2xl mx-auto p-4 sm:p-6 md:p-8 rounded-3xl border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Decoración del crate */}
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"></div>
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg"></div>
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"></div>

              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Tu Crate Personal</h2>
                <p className="text-sm sm:text-base text-gray-400">Los elementos que definen tu gusto musical</p>
              </div>

              {/* Grid de elementos del crate */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {/* Artistas */}
                {favoriteArtists.map((artist, index) => (
                  <div key={`artist-${artist.id}`} className="group relative">
                    <div 
                      className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))' }}
                    >
                      <img 
                        src={artist.image} 
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 sm:p-3">
                        <div className="text-white w-full">
                          <div className="flex items-center gap-1 mb-1">
                            <i className="ri-mic-fill text-purple-400 text-xs"></i>
                            <span className="text-xs text-purple-300 font-medium">ARTISTA</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold truncate">{artist.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Álbumes */}
                {favoriteAlbums.map((album, index) => (
                  <div key={`album-${album.id}`} className="group relative">
                    <div 
                      className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))' }}
                    >
                      <img 
                        src={album.image} 
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 sm:p-3">
                        <div className="text-white w-full">
                          <div className="flex items-center gap-1 mb-1">
                            <i className="ri-album-fill text-blue-400 text-xs"></i>
                            <span className="text-xs text-blue-300 font-medium">ÁLBUM</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold truncate">{album.title}</p>
                          <p className="text-xs text-gray-400 truncate">{album.artist}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estadísticas del crate */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">{favoriteArtists.length}</div>
                  <div className="text-gray-400">Artistas</div>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">{favoriteAlbums.length}</div>
                  <div className="text-gray-400">Álbumes</div>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">∞</div>
                  <div className="text-gray-400">Posibilidades</div>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="mb-6 sm:mb-8 px-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">¿Qué sigue?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <i className="ri-compass-3-fill text-white text-lg sm:text-xl"></i>
                </div>
                <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Descubre música</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Encuentra nuevos artistas y álbumes basados en tu crate</p>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <i className="ri-team-fill text-white text-lg sm:text-xl"></i>
                </div>
                <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Conecta con otros</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Encuentra usuarios con gustos musicales similares</p>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <i className="ri-playlist-add-fill text-white text-lg sm:text-xl"></i>
                </div>
                <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Crea listas</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Organiza tu música en colecciones temáticas</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button
              onClick={onComplete}
              className="group relative px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-bold text-base sm:text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl transform w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3">
                <i className="ri-compass-discover-fill text-xl sm:text-2xl"></i>
                <span>Explorar CrateCloud</span>
                <i className="ri-arrow-right-line text-lg sm:text-xl group-hover:translate-x-2 transition-transform duration-300"></i>
              </div>
            </button>
          </div>

          {/* Mensaje de bienvenida personalizado */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mx-4">
            <p className="text-green-400 font-medium text-sm sm:text-base text-center">
              ¡Bienvenido a CrateCloud, {spotifyProfile?.display_name || 'melómano'}! 
              Tu viaje musical personalizado comienza ahora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;