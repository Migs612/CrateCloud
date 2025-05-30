import React from "react";

const WelcomeScreen = ({ onSpotifyAuth }) => {
  const handleSpotifyConnect = () => {
    // Aquí implementarías la autenticación real de Spotify
    // Por ahora simulo el flujo para mostrar el diseño
    const mockProfile = {
      id: "user123",
      display_name: "Usuario Demo",
      images: [{ url: "https://i.pravatar.cc/150?img=68" }],
    };
    onSpotifyAuth(mockProfile);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradientes flotantes con colores de CrateCloud */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full filter blur-[100px] opacity-20 animate-pulse"
          style={{
            backgroundColor: "hsl(var(--color-primary))",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full filter blur-[120px] opacity-15 animate-pulse"
          style={{
            backgroundColor: "hsl(var(--color-primary-light))",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full filter blur-[80px] opacity-10 animate-pulse"
          style={{
            backgroundColor: "hsl(var(--color-primary-dark))",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />

        {/* Partículas musicales flotantes alejadas del centro */}
        <div
          className="absolute top-20 left-10 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "0s" }}
        >
          <i className="ri-music-2-line text-white/6 text-5xl"></i>
        </div>
        <div
          className="absolute bottom-20 right-10 animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        >
          <i className="ri-headphone-line text-white/6 text-4xl"></i>
        </div>
        <div
          className="absolute top-32 right-16 animate-bounce"
          style={{ animationDuration: "3.5s", animationDelay: "2s" }}
        >
          <i className="ri-disc-line text-white/5 text-3xl"></i>
        </div>
        <div
          className="absolute bottom-32 left-16 animate-bounce"
          style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}
        >
          <i className="ri-album-line text-white/5 text-3xl"></i>
        </div>
        <div
          className="absolute top-1/2 left-8 animate-bounce"
          style={{ animationDuration: "6s", animationDelay: "3s" }}
        >
          <i className="ri-equalizer-line text-white/4 text-2xl"></i>
        </div>
        <div
          className="absolute top-1/2 right-8 animate-bounce"
          style={{ animationDuration: "3.8s", animationDelay: "1.5s" }}
        >
          <i className="ri-volume-up-line text-white/4 text-2xl"></i>
        </div>
      </div>

      {/* Contenido principal integrado */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="max-w-2xl text-center w-full">
          {/* Overlay sutil para integrar mejor */}
          <div
            className="absolute inset-0 rounded-[10rem] backdrop-blur-[2px] opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at center, hsl(var(--color-primary-dark)/0.15), transparent 70%)",
            }}
          ></div>
          {/* Logo y título principal */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 shadow-2xl transition-all duration-700 hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                  boxShadow: `0 20px 40px hsl(var(--color-primary)/0.4)`,
                }}
              >
                <i className="ri-headphone-fill text-white text-2xl sm:text-3xl"></i>
              </div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(var(--color-primary-light)), white, hsl(var(--color-primary)))`,
                }}
              >
                CrateCloud
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <i
                className="ri-headphone-line text-xl sm:text-2xl md:text-3xl"
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
                Bienvenido a CrateCloud
              </h2>
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg mx-auto px-4">
              Conéctate con tu música. Empieza con Spotify.
            </p>
          </div>

          {/* Sección visual de características */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 px-2 sm:px-0">
            <div
              className="flex flex-col items-center p-4 sm:p-6 md:p-8 rounded-3xl backdrop-blur-md transition-all duration-300 hover:scale-102 group cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--color-primary-dark)/0.08)" }}
            >
              {/* Efecto de brillo en hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle at center, hsl(var(--color-primary)/0.1), transparent 70%)",
                }}
              ></div>
              <div
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                }}
              >
                <i className="ri-music-2-fill text-white text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <h3 className="relative text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-primary-light transition-colors duration-300">
                Descubre
              </h3>
              <p className="relative text-xs sm:text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Encuentra nueva música basada en tus gustos
              </p>
            </div>

            <div
              className="flex flex-col items-center p-4 sm:p-6 md:p-8 rounded-3xl backdrop-blur-md transition-all duration-300 hover:scale-102 group cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--color-primary-dark)/0.08)" }}
            >
              {/* Efecto de brillo en hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle at center, hsl(var(--color-primary)/0.1), transparent 70%)",
                }}
              ></div>
              <div
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--color-primary-light)), hsl(var(--color-primary)))`,
                }}
              >
                <i className="ri-team-fill text-white text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <h3 className="relative text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-primary-light transition-colors duration-300">
                Conecta
              </h3>
              <p className="relative text-xs sm:text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Comparte tus listas con otros melómanos
              </p>
            </div>

            <div
              className="flex flex-col items-center p-4 sm:p-6 md:p-8 rounded-3xl backdrop-blur-md transition-all duration-300 hover:scale-102 group cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--color-primary-dark)/0.08)" }}
            >
              {/* Efecto de brillo en hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle at center, hsl(var(--color-primary)/0.1), transparent 70%)",
                }}
              ></div>
              <div
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--color-primary-dark)), hsl(var(--color-primary)))`,
                }}
              >
                <i className="ri-heart-fill text-white text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
              </div>
              <h3 className="relative text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-primary-light transition-colors duration-300">
                Organiza
              </h3>
              <p className="relative text-xs sm:text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Crea colecciones únicas de tus álbumes favoritos
              </p>
            </div>
          </div>

          {/* Botón principal de Spotify */}
          <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
            <button
              onClick={handleSpotifyConnect}
              className="group relative px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-3xl text-white font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-3xl w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                boxShadow: `0 25px 50px hsl(var(--color-primary)/0.4)`,
              }}
            >
              <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                <i className="ri-spotify-fill text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300"></i>
                <span>Iniciar con Spotify</span>
                <i className="ri-arrow-right-line text-lg sm:text-xl md:text-2xl group-hover:translate-x-3 transition-all duration-300"></i>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-gray-400 transition-all duration-300 hover:text-gray-300 max-w-md mx-auto">
              Necesitamos acceso a tu perfil de Spotify para personalizar tu
              experiencia
            </p>
          </div>

          {/* Elementos decorativos inferiores */}
          <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 opacity-40">
            <div className="flex items-center gap-2 transition-all duration-300 hover:opacity-100">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                style={{ backgroundColor: "hsl(var(--color-primary))" }}
              ></div>
              <span className="text-xs text-gray-400">Seguro</span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-300 hover:opacity-100">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: "hsl(var(--color-primary-light))",
                  animationDelay: "0.5s",
                }}
              ></div>
              <span className="text-xs text-gray-400">Privado</span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-300 hover:opacity-100">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: "hsl(var(--color-primary-dark))",
                  animationDelay: "1s",
                }}
              ></div>
              <span className="text-xs text-gray-400">Personalizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
