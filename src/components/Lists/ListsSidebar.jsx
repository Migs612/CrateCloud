
import React from 'react';
import { Link } from 'react-router-dom';

const ListsSidebar = ({ recentlyLiked, userLists, likedLists, albumListCount, setShowCreateModal }) => {
  return (
    <div className="w-80 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Recientemente gustado */}
        <div
          className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            backgroundColor: "hsl(var(--color-primary-dark)/0.05)",
            borderColor: "hsl(var(--color-primary)/0.2)",
            boxShadow: "0 8px 32px hsl(var(--color-primary)/0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-heart-fill text-red-400"></i>
            <h3 className="text-lg font-semibold text-white">
              Recientemente gustado
            </h3>
          </div>

          <div className="space-y-3">
            {recentlyLiked.map((item) => (
              <Link
                key={item.id}
                to={`/list/${item.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/60">por {item.creator}</p>
                </div>
              </Link>
            ))}
          </div>


        </div>

        {/* Estadísticas */}
        <div
          className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            backgroundColor: "hsl(var(--color-primary-dark)/0.05)",
            borderColor: "hsl(var(--color-primary)/0.2)",
            boxShadow: "0 8px 32px hsl(var(--color-primary)/0.1)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Tu actividad
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                Listas creadas
              </span>
              <span
                className="font-semibold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {userLists.length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                Álbumes guardados
              </span>
              <span
                className="font-semibold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {albumListCount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                Listas gustadas
              </span>
              <span
                className="font-semibold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {likedLists.size}
              </span>
            </div>
          </div>
        </div>

        {/* Acceso rápido */}
        <div
          className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            backgroundColor: "hsl(var(--color-primary-dark)/0.05)",
            borderColor: "hsl(var(--color-primary)/0.2)",
            boxShadow: "0 8px 32px hsl(var(--color-primary)/0.1)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Acceso rápido
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full text-left p-3 rounded-lg transition-colors hover:bg-white/5 flex items-center gap-3"
            >
              <i
                className="ri-add-circle-line"
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
              <span className="text-white/80 text-sm">
                Crear nueva lista
              </span>
            </button>

            <Link
              to="/lists/listen-later"
              className="w-full text-left p-3 rounded-lg transition-colors hover:bg-white/5 flex items-center gap-3"
            >
              <i
                className="ri-time-line"
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
              <span className="text-white/80 text-sm">
                Escuchar luego
              </span>
            </Link>

            <Link
              to="/albums"
              className="w-full text-left p-3 rounded-lg transition-colors hover:bg-white/5 flex items-center gap-3"
            >
              <i
                className="ri-compass-line"
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
              <span className="text-white/80 text-sm">
                Descubrir música
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListsSidebar;
