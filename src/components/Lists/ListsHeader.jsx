
import React from 'react';

const ListsHeader = ({ userLists, setShowCreateModal, albumListCount }) => {
  return (
    <div className="pt-24 pb-12 relative overflow-hidden">
      {/* Elementos decorativos elegantes */}
      <div
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full filter blur-[120px]"
        style={{
          backgroundColor: "hsl(var(--color-primary)/0.15)",
        }}
      />
      <div
        className="absolute top-10 right-1/4 w-80 h-80 rounded-full filter blur-[100px]"
        style={{
          backgroundColor: "hsl(var(--color-primary-light)/0.1)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                boxShadow: "0 8px 24px hsl(var(--color-primary)/0.4)",
              }}
            >
              <i className="ri-folder-music-line text-white text-2xl"></i>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold font-unbounded text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(var(--color-primary-light)), hsl(var(--color-primary)))`,
              }}
            >
              Mis Listas
            </h1>
          </div>

          <p
            className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto"
            style={{ color: "hsl(var(--color-primary-light)/0.8)" }}
          >
            Organiza tu música favorita en colecciones únicas y descubre las
            mejores listas de la comunidad
          </p>

          {/* Estadísticas rápidas */}
          <div className="flex items-center justify-center gap-8 mb-8 text-sm">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {userLists.length}
              </div>
              <div className="text-white/60">Mis listas</div>
            </div>
            <div
              className="w-px h-8"
              style={{ backgroundColor: "hsl(var(--color-primary)/0.3)" }}
            />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {albumListCount}
              </div>
              <div className="text-white/60">Álbumes guardados</div>
            </div>
            <div
              className="w-px h-8"
              style={{ backgroundColor: "hsl(var(--color-primary)/0.3)" }}
            />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--color-primary-light))" }}
              >
                {userLists.filter(list => !list.isPrivate).length}
              </div>
              <div className="text-white/60">Listas públicas</div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 rounded-xl text-white flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 hover:shadow-2xl font-semibold text-lg group relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
              boxShadow: "0 8px 32px hsl(var(--color-primary)/0.4)",
            }}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <i className="ri-add-circle-line text-2xl group-hover:rotate-90 transition-transform duration-300 relative z-10"></i>
            <span className="relative z-10">Crear nueva lista</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListsHeader;
