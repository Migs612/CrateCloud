import React, { useState, useEffect } from "react";
import Navbar from "../components/Global/Navbar";
import Footer from "../components/Global/Footer";

const Amigos = () => {
  // Usamos variables CSS directamente en vez de usar el contexto
  const primaryColor = `hsl(var(--color-primary))`;
  const [friends, setFriends] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("amigos");
  const [likedSongs, setLikedSongs] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [following, setFollowing] = useState({});

  // Datos simulados para amigos
  useEffect(() => {
    // Estos serían obtenidos de una API en un entorno real
    const mockFriends = [
      {
        id: 1,
        name: "María García",
        username: "mariagarcia",
        avatar: "https://i.pravatar.cc/150?img=5",
        compatibility: 87,
        commonArtists: ["Bad Bunny", "Rosalía", "Karol G"],
        lastPlayed: [
          {
            id: 101,
            title: "MONACO",
            artist: "Bad Bunny",
            album: "Nadie Sabe Lo Que Va a Pasar Mañana",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273365b1c01ae5bf9352e0c09bd",
            timestamp: "1 min atrás",
          },
          {
            id: 102,
            title: "PERRO NEGRO",
            artist: "Bad Bunny ft. Feid",
            album: "Nadie Sabe Lo Que Va a Pasar Mañana",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273365b1c01ae5bf9352e0c09bd",
            timestamp: "12 min atrás",
          },
          {
            id: 103,
            title: "BATICANO",
            artist: "Bad Bunny",
            album: "Nadie Sabe Lo Que Va a Pasar Mañana",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273365b1c01ae5bf9352e0c09bd",
            timestamp: "18 min atrás",
          },
        ],
      },
      {
        id: 2,
        name: "Carlos Rodríguez",
        username: "carlos_music",
        avatar: "https://i.pravatar.cc/150?img=12",
        compatibility: 73,
        commonArtists: ["Kendrick Lamar", "J. Cole", "Drake"],
        lastPlayed: [
          {
            id: 201,
            title: "DNA.",
            artist: "Kendrick Lamar",
            album: "DAMN.",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273d28d2ebdeab1c7efb5bfcec5",
            timestamp: "5 min atrás",
          },
          {
            id: 202,
            title: "HUMBLE.",
            artist: "Kendrick Lamar",
            album: "DAMN.",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273d28d2ebdeab1c7efb5bfcec5",
            timestamp: "8 min atrás",
          },
          {
            id: 203,
            title: "Money Trees",
            artist: "Kendrick Lamar ft. Jay Rock",
            album: "good kid, m.A.A.d city",
            cover:
              "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
            timestamp: "17 min atrás",
          },
        ],
      },
      {
        id: 3,
        name: "Laura Martínez",
        username: "lauramusic",
        avatar: "https://i.pravatar.cc/150?img=9",
        compatibility: 92,
        commonArtists: ["Taylor Swift", "Lana Del Rey", "Billie Eilish"],
        lastPlayed: [
          {
            id: 301,
            title: "cruel summer",
            artist: "Taylor Swift",
            album: "Lover",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
            timestamp: "2 min atrás",
          },
          {
            id: 302,
            title: "Cruel Summer",
            artist: "Taylor Swift",
            album: "Lover",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
            timestamp: "4 min atrás",
          },
          {
            id: 303,
            title: "Anti-Hero",
            artist: "Taylor Swift",
            album: "Midnights",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
            timestamp: "7 min atrás",
          },
        ],
      },
      {
        id: 4,
        name: "David Pérez",
        username: "davidmusicpro",
        avatar: "https://i.pravatar.cc/150?img=15",
        compatibility: 65,
        commonArtists: ["Daft Punk", "The Weeknd", "Coldplay"],
        lastPlayed: [
          {
            id: 401,
            title: "Get Lucky",
            artist: "Daft Punk ft. Pharrell Williams",
            album: "Random Access Memories",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273b1f8da74f225fa1225cdface",
            timestamp: "23 min atrás",
          },
          {
            id: 402,
            title: "Starboy",
            artist: "The Weeknd ft. Daft Punk",
            album: "Starboy",
            cover:
              "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
            timestamp: "28 min atrás",
          },
          {
            id: 403,
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            cover:
              "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
            timestamp: "34 min atrás",
          },
        ],
      },
    ];

    const mockRecommended = [
      {
        id: 5,
        name: "Ana López",
        username: "anamusic",
        avatar: "https://i.pravatar.cc/150?img=23",
        compatibility: 88,
        commonArtists: ["Ariana Grande", "Dua Lipa", "Lady Gaga"],
        lastPlayed: [
          {
            id: 501,
            title: "positions",
            artist: "Ariana Grande",
            album: "Positions",
            cover:
              "https://i.scdn.co/image/ab67616d0000b27355e5c281705be219322444a2",
            timestamp: "10 min atrás",
          },
        ],
      },
      {
        id: 6,
        name: "Miguel Torres",
        username: "miguel_t",
        avatar: "https://i.pravatar.cc/150?img=32",
        compatibility: 79,
        commonArtists: ["Arctic Monkeys", "The Strokes", "Tame Impala"],
        lastPlayed: [
          {
            id: 601,
            title: "Do I Wanna Know?",
            artist: "Arctic Monkeys",
            album: "AM",
            cover:
              "https://i.scdn.co/image/ab67616d0000b2739f39192ab232afefd1278093",
            timestamp: "15 min atrás",
          },
        ],
      },
      {
        id: 7,
        name: "Sofía Ramírez",
        username: "sofiamusic",
        avatar: "https://i.pravatar.cc/150?img=41",
        compatibility: 81,
        commonArtists: ["Billie Eilish", "ROSALÍA", "Olivia Rodrigo"],
        lastPlayed: [
          {
            id: 701,
            title: "MALAMENTE",
            artist: "ROSALÍA",
            album: "EL MAL QUERER",
            cover:
              "https://i.scdn.co/image/ab67616d0000b273b87427301d8f7ccffd5d317d",
            timestamp: "8 min atrás",
          },
        ],
      },
    ];

    setFriends(mockFriends);
    setRecommendedFriends(mockRecommended);
  }, []);

  // Obtener color para el indicador de compatibilidad
  const getCompatibilityClass = (score) => {
    if (score >= 85) return "bg-gradient-to-br from-green-500 to-green-400";
    if (score >= 70) return "bg-gradient-to-br from-yellow-500 to-yellow-400";
    return "bg-gradient-to-br from-orange-500 to-orange-400";
  };

  // Generar gradiente para las tarjetas
  const getRandomGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, rgba(59, 130, 246, 0.07) 0%, rgba(139, 92, 246, 0.07) 100%)",
      "linear-gradient(135deg, rgba(236, 72, 153, 0.07) 0%, rgba(139, 92, 246, 0.07) 100%)",
      "linear-gradient(135deg, rgba(139, 92, 246, 0.07) 0%, rgba(16, 185, 129, 0.07) 100%)",
      "linear-gradient(135deg, rgba(249, 115, 22, 0.07) 0%, rgba(139, 92, 246, 0.07) 100%)",
      "linear-gradient(135deg, rgba(139, 92, 246, 0.07) 0%, rgba(236, 72, 153, 0.07) 100%)",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 w-[90%] lg:w-[80%] mt-10 mx-auto mb-12 text-white min-h-screen py-8 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div
    className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full blur-xl opacity-60"
    style={{
      background: `radial-gradient(circle, ${primaryColor || "#9d4edd"} 0%, rgba(157, 78, 221, 0.1) 100%)`,
    }}
  ></div>
  <div
    className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full blur-xl opacity-50"
    style={{
      background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 100%)",
    }}
  ></div>

        {/* Encabezado de la página */}
        <div className="relative z-10 text-center mb-14">
          <h1 className="text-5xl font-bold text-white mb-4 font-unbounded drop-shadow-lg">
            Tus Conexiones Musicales
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explora los gustos musicales de tus amigos y descubre nueva música
            basada en sus preferencias
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
          <div className="glass-rounded p-4 text-center backdrop-blur-lg">
            <div className="text-3xl font-bold text-white mb-1">
              {friends.length}
            </div>
            <div className="text-sm text-white/60">Amigos</div>
          </div>
          <div className="glass-rounded p-4 text-center backdrop-blur-lg">
            <div className="text-3xl font-bold text-white mb-1">42</div>
            <div className="text-sm text-white/60">Artistas en común</div>
          </div>
          <div className="glass-rounded p-4 text-center backdrop-blur-lg">
            <div className="text-3xl font-bold text-white mb-1">87%</div>
            <div className="text-sm text-white/60">Compatibilidad máx.</div>
          </div>
          <div className="glass-rounded p-4 text-center backdrop-blur-lg">
            <div className="text-3xl font-bold text-white mb-1">128</div>
            <div className="text-sm text-white/60">Escuchadas hoy</div>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="relative z-10 flex justify-center mb-10">
          <div className="bg-black/20 backdrop-blur-md p-1 rounded-full flex">
            <button
              className={`px-6 py-3 rounded-full transition-all text-lg ${
                activeTab === "amigos"
                  ? "bg-gradient-to-r shadow-lg text-white font-medium"
                  : "text-white/60 hover:text-white/90"
              }`}
              style={
                activeTab === "amigos"
                  ? {
                      backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                      boxShadow: `0 4px 15px hsl(var(--color-primary)/0.4)`,
                    }
                  : {}
              }
              onClick={() => setActiveTab("amigos")}
            >
              <div className="flex items-center gap-2">
                <i className="ri-user-heart-line"></i>
                <span>Amigos</span>
                <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {friends.length}
                </span>
              </div>
            </button>
            <button
              className={`px-6 py-3 rounded-full transition-all text-lg ${
                activeTab === "recomendados"
                  ? "bg-gradient-to-r shadow-lg text-white font-medium"
                  : "text-white/60 hover:text-white/90"
              }`}
              style={
                activeTab === "recomendados"
                  ? {
                      backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                      boxShadow: `0 4px 15px hsl(var(--color-primary)/0.4)`,
                    }
                  : {}
              }
              onClick={() => setActiveTab("recomendados")}
            >
              <div className="flex items-center gap-2">
                <i className="ri-user-search-line"></i>
                <span>Recomendados</span>
                <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {recommendedFriends.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Lista de amigos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {(activeTab === "amigos" ? friends : recommendedFriends).map(
            (friend, index) => (
              <div
                key={friend.id}
                className="glass-rounded p-0 backdrop-blur-xl border border-white/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: getRandomGradient(index),
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Encabezado de la tarjeta */}
                <div
                  className={`px-6 ${activeTab === "recomendados" ? "pt-4 pb-2" : "pt-6 pb-4"}`}
                >
                  <div className="flex items-start gap-5">
                    {/* Foto de perfil y compatibilidad */}
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-full overflow-hidden p-1"
                        style={{
                          background:
                            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getCompatibilityClass(friend.compatibility)}`}
                        style={{
                          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {friend.compatibility}%
                      </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-white font-unbounded">
                          {friend.name}
                        </h3>
                        {activeTab === "amigos" && (
                          <button
                            onClick={() => {
                              setSelectedFriend(friend);
                              setShowShareModal(true);
                            }}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
                          >
                            <i className="ri-share-line"></i>
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-3">
                        @{friend.username}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {friend.commonArtists.map((artist, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/80 backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="px-6 pb-4 flex justify-between">
                  <div className="flex gap-2">
                    {/* El botón de mensaje ha sido eliminado */}
                  </div>

                  {activeTab === "amigos" ? (
                    <button
                      className="text-sm text-white hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors bg-white/5 hover:bg-white/10"
                      style={{ color: `hsl(var(--color-primary))` }}
                    >
                      Ver perfil <i className="ri-arrow-right-line"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setFollowing((prev) => ({
                          ...prev,
                          [friend.id]: !prev[friend.id],
                        }));
                      }}
                      className="text-sm px-4 py-2 rounded-full flex items-center gap-1 text-white transition-all duration-300"
                      style={{
                        backgroundImage: following[friend.id]
                          ? "linear-gradient(to right, #32CD32, #32CD3290)"
                          : `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                        boxShadow: following[friend.id]
                          ? "0 4px 15px rgba(50, 205, 50, 0.4)"
                          : `0 4px 15px hsl(var(--color-primary)/0.4)`,
                      }}
                    >
                      <i
                        className={
                          following[friend.id]
                            ? "ri-check-line"
                            : "ri-user-add-line"
                        }
                      ></i>
                      {following[friend.id] ? "Siguiendo" : "Seguir"}
                    </button>
                  )}
                </div>

                {/* Últimas canciones reproducidas */}
                {activeTab === "amigos" && (
                  <div className="border-t border-white/10">
                    <div className="px-6 py-3 bg-black/20 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white/90">
                          Escuchando ahora
                        </h4>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                          {friend.lastPlayed.length} canciones
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {friend.lastPlayed.map((song, songIndex) => (
                        <div
                          key={song.id}
                          className="px-6 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 group"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden relative flex-shrink-0 shadow-md">
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-black">
                                <i className="ri-play-fill text-lg"></i>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              {songIndex === 0 && (
                                <span className="mr-1.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              )}
                              <div className="truncate text-sm font-medium text-white/90">
                                {song.title}
                              </div>
                            </div>
                            <div className="text-xs text-white/60 truncate">
                              {song.artist}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
                              {song.timestamp}
                            </div>
                            <button
                              onClick={() => {
                                setLikedSongs((prev) => ({
                                  ...prev,
                                  [song.id]: !prev[song.id],
                                }));
                              }}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity ${likedSongs[song.id] ? "" : "text-white/40 hover:text-white/80"}`}
                              style={
                                likedSongs[song.id]
                                  ? { color: "hsl(var(--color-primary))" }
                                  : {}
                              }
                            >
                              <i
                                className={`${likedSongs[song.id] ? "ri-heart-fill" : "ri-heart-line"}`}
                              ></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        {/* Si no hay amigos */}
        {activeTab === "amigos" && friends.length === 0 && (
          <div className="text-center py-12 glass-rounded backdrop-blur-md p-10">
            <i className="ri-user-search-line text-5xl text-white/30 mb-5 block"></i>
            <h3 className="text-2xl font-medium text-white/80 mb-3">
              Aún no tienes amigos
            </h3>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              Conecta con amigos para descubrir nueva música y ver lo que están
              escuchando. Te recomendaremos personas con gustos musicales
              similares a los tuyos.
            </p>
            <button
              className="px-6 py-3 rounded-full text-white font-medium shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                boxShadow: `0 4px 15px hsl(var(--color-primary)/0.4)`,
              }}
            >
              <i className="ri-user-add-line mr-2"></i> Encontrar amigos
            </button>
          </div>
        )}

        {/* Si no hay amigos recomendados */}
        {activeTab === "recomendados" && recommendedFriends.length === 0 && (
          <div className="text-center py-12 glass-rounded backdrop-blur-md p-10">
            <i className="ri-radar-line text-5xl text-white/30 mb-5 block"></i>
            <h3 className="text-2xl font-medium text-white/80 mb-3">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              Escucha más música para que podamos recomendarte personas con
              gustos similares. Nuestro algoritmo necesita más datos para
              encontrar conexiones musicales de calidad.
            </p>
            <button
              className="px-6 py-3 rounded-full text-white font-medium shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                boxShadow: `0 4px 15px hsl(var(--color-primary)/0.4)`,
              }}
            >
              <i className="ri-play-circle-line mr-2"></i> Explorar música
            </button>
          </div>
        )}
      </div>

      {/* Modal de compartir amigo */}
      {showShareModal && selectedFriend && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-900/90 border border-white/10 rounded-lg max-w-md w-full animate-fade-in overflow-hidden">
            {/* Imagen de fondo con gradiente */}
            <div
              className="absolute inset-0 opacity-30 z-0"
              style={{
                background: `linear-gradient(to bottom right, hsla(var(--color-primary)/0.4), transparent)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* Encabezado */}
            <div className="relative z-10 flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">
                Compartir conexión musical
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white/60 hover:text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Contenido */}
            <div className="relative z-10 p-5">
              {/* Vista previa para compartir */}
              <div className="p-5 rounded-lg bg-black/30 backdrop-blur-md border border-white/5 mb-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="flex items-center justify-center mb-3 relative">
                    {/* Mi foto de perfil */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 z-10 -mr-2">
                      <img
                        src="https://i.pravatar.cc/150?img=1"
                        alt="Mi perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Círculo de compatibilidad */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 border border-white/10"
                      style={{
                        background: `linear-gradient(to bottom right, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                        boxShadow: "0 2px 8px hsla(var(--color-primary)/0.5)",
                      }}
                    >
                      {selectedFriend.compatibility}%
                    </div>

                    {/* Foto del amigo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 z-10 -ml-2">
                      <img
                        src={selectedFriend.avatar}
                        alt={selectedFriend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h4 className="text-lg text-white font-medium text-center">
                    {selectedFriend.name} y yo tenemos un{" "}
                    {selectedFriend.compatibility}% de compatibilidad musical
                  </h4>

                  {/* Artistas en común */}
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {selectedFriend.commonArtists.map((artist, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/80 backdrop-blur-sm border border-white/5"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-white/60 text-sm">
                  Descubre conexiones musicales en CrateCloud
                </div>
              </div>

              {/* Opciones para compartir */}
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Compartir en:
              </h4>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <button className="flex flex-col items-center gap-1 w-16 h-16 hover:scale-110 transition-transform">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <i className="ri-facebook-fill text-white text-xl"></i>
                  </div>
                  <span className="text-white/80 text-xs">Facebook</span>
                </button>

                <button className="flex flex-col items-center gap-1 w-16 h-16 hover:scale-110 transition-transform">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                    <i className="ri-twitter-x-fill text-white text-xl"></i>
                  </div>
                  <span className="text-white/80 text-xs">Twitter</span>
                </button>

                <button className="flex flex-col items-center gap-1 w-16 h-16 hover:scale-110 transition-transform">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                    <i className="ri-whatsapp-fill text-white text-xl"></i>
                  </div>
                  <span className="text-white/80 text-xs">WhatsApp</span>
                </button>

                <button className="flex flex-col items-center gap-1 w-16 h-16 hover:scale-110 transition-transform">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <i className="ri-instagram-fill text-white text-xl"></i>
                  </div>
                  <span className="text-white/80 text-xs">Instagram</span>
                </button>
              </div>

              {/* Enlace para copiar */}
              <div className="mt-2">
                <div className="flex rounded-md overflow-hidden">
                  <input
                    type="text"
                    value={`https://cratecloud.com/compatibilidad/${selectedFriend.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-black/30 text-white/90 border-y border-l border-white/10 text-sm focus:outline-none"
                  />
                  <button
                    className="px-4 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "hsl(var(--color-primary))" }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      )}
                <Footer/>

    </>
  );
};

export default Amigos;
