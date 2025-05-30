
import React from 'react';

const FeaturedListCard = ({ list, likedLists, handleLike }) => {
  return (
    <div
      className="p-0 h-full group rounded-2xl backdrop-blur-md border relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: "hsl(var(--color-primary-dark)/0.1)",
        borderColor: "hsl(var(--color-primary)/0.4)",
        boxShadow: "0 12px 40px hsl(var(--color-primary)/0.15)",
      }}
      onClick={() => window.location.href = `/lists/${list.id}`}
    >
      {/* Badge y trending indicator más elegante */}
      <div className="absolute top-3 left-3 z-30 flex gap-2">
        {list.trending && (
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border"
            style={{
              backgroundColor: "rgba(255, 68, 68, 0.9)",
              borderColor: "rgba(255, 68, 68, 0.3)",
              color: "white",
            }}
          >
            TRENDING
          </div>
        )}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
          style={{
            backgroundColor: "hsl(var(--color-primary)/0.9)",
            borderColor: "hsl(var(--color-primary)/0.3)",
            color: "white",
          }}
        >
          {list.badge}
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />

      {/* Portadas */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10"></div>

        {list.coverImages.length > 0 ? (
          <div className="h-full w-full flex gap-1">
            {list.coverImages.slice(0, 3).map((cover, index) => (
              <div key={index} className="flex-1 h-full overflow-hidden">
                <img
                  src={cover}
                  alt="Portada"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, hsl(var(--color-primary)/0.4), hsl(var(--color-primary-dark)/0.4))`,
            }}
          />
        )}

        {/* Información del creador y estadísticas */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={list.creator.avatar}
              alt={list.creator.username}
              className="w-8 h-8 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-colors"
            />
            <span className="text-white text-sm font-medium">
              {list.creator.username}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-bold text-white text-xl mb-3 leading-tight group-hover:text-white/90 transition-colors">
            {list.title}
          </h3>

          {/* Estadísticas mejoradas */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
              <i className="ri-heart-fill text-red-400"></i>
              <span className="font-medium">
                {list.likes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <i className="ri-chat-3-fill text-blue-400"></i>
              <span className="font-medium">{list.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <i
                className="ri-album-fill"
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
              <span className="font-medium">{list.itemCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción y acciones */}
      <div className="p-4">
        <p className="text-sm text-white/70 line-clamp-2 mb-3 leading-relaxed">
          {list.description}
        </p>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/lists/${list.id}`;
            }}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "hsl(var(--color-primary)/0.2)",
              borderColor: "hsl(var(--color-primary)/0.4)",
              color: "hsl(var(--color-primary-light))",
              border: "1px solid",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor =
                "hsl(var(--color-primary)/0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                "hsl(var(--color-primary)/0.2)";
            }}
          >
            Ver lista
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLike(list.id);
            }}
            className="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 hover:bg-red-500/20 group/like"
            style={{
              backgroundColor: likedLists.has(list.id)
                ? "rgba(239, 68, 68, 0.2)"
                : "hsl(var(--color-primary-dark)/0.3)",
              color: likedLists.has(list.id)
                ? "#ef4444"
                : "white",
              borderColor: likedLists.has(list.id)
                ? "rgba(239, 68, 68, 0.5)"
                : "transparent",
              border: "1px solid",
            }}
            onMouseEnter={(e) => {
              if (!likedLists.has(list.id)) {
                e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                e.target.style.color = "#ef4444";
              }
            }}
            onMouseLeave={(e) => {
              if (!likedLists.has(list.id)) {
                e.target.style.backgroundColor = "hsl(var(--color-primary-dark)/0.3)";
                e.target.style.color = "white";
              }
            }}
          >
            <i
              className={`${
                likedLists.has(list.id) ? "ri-heart-fill" : "ri-heart-line"
              } group-hover/like:scale-110 transition-transform duration-200`}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListCard;
