import React, { useEffect, useState } from 'react';

const Listeners = ({ artistId }) => {
  const [listeners, setListeners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistId) return;

    const fetchListeners = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/artists/${artistId}/listeners`);
        const data = await res.json();
        setListeners(data);
      } catch (error) {
        console.error('Error al obtener oyentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListeners();
  }, [artistId]);

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Oyentes recientes</h2>

      {loading ? (
        <div className="text-white/50">Cargando oyentes...</div>
      ) : listeners.length === 0 ? (
        <div className="text-white/40 text-sm">Este artista aún no tiene seguidores.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
          {listeners.map(listener => (
            <div
              key={listener.uid}
              className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer rounded-lg"
            >
              <img
                src={listener.avatarUrl}
                alt={listener.username}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/10"
              />
              <div>
                <div className="text-white font-medium text-sm sm:text-base">{listener.username}</div>
                {listener.favoriteSong && (
                  <div className="text-white/60 text-xs sm:text-sm flex items-center">
                    <span>Escucha mucho </span>
                    <span className="text-purple-400 hover:underline ml-1">{listener.favoriteSong}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Listeners;
