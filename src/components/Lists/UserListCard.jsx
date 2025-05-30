import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserListCard = ({ list }) => {
  const [songCovers, setSongCovers] = useState([]);

  useEffect(() => {
    const fetchSongCovers = async () => {
      if (!list.coverImageUrl && list.songIds?.length > 0) {
        try {
          const covers = [];
          for (let i = 0; i < Math.min(3, list.songIds.length); i++) {
            const songId = list.songIds[i];
            const res = await fetch(`http://localhost:4000/api/songs/${songId}`);
            const song = await res.json();
            if (song.coverUrl) covers.push(song.coverUrl);
          }
          setSongCovers(covers);
        } catch (err) {
          console.error("Error al obtener portadas de canciones", err);
        }
      }
    };

    fetchSongCovers();
  }, [list]);

  const isDefaultList = list.isDefault;

  return (
    <Link to={`/lists/${list._id}`} className="block group">
      <div
        className={`p-4 h-full hover:translate-y-[-4px] transition-all duration-300 border rounded-2xl backdrop-blur-md relative overflow-hidden hover:scale-105 ${
          isDefaultList ? "ring-2 ring-offset-2 ring-offset-transparent" : ""
        }`}
        style={{
          backgroundColor: isDefaultList
            ? "hsl(var(--color-primary)/0.15)"
            : "hsl(var(--color-primary-dark)/0.1)",
          borderColor: isDefaultList
            ? "hsl(var(--color-primary)/0.6)"
            : "hsl(var(--color-primary)/0.3)",
          boxShadow: isDefaultList
            ? "0 12px 40px hsl(var(--color-primary)/0.3), 0 0 0 1px hsl(var(--color-primary)/0.2)"
            : "0 8px 32px hsl(var(--color-primary)/0.1)",
        }}
      >
        {/* Portada */}
        <div className="relative h-36 mb-3 overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 z-10 group-hover:opacity-70 transition-opacity"
            style={{
              background: `linear-gradient(135deg, hsl(var(--color-primary)/0.4), hsl(var(--color-primary-light)/0.5))`,
            }}
          />

          {list.coverImageUrl ? (
            <img
              src={list.coverImageUrl}
              alt="Portada lista"
              className="w-full h-full object-cover rounded"
            />
          ) : songCovers.length > 0 ? (
            <div className="h-full w-full flex gap-1">
              {songCovers.map((cover, i) => (
                <div key={i} className="flex-1 h-full overflow-hidden rounded">
                  <img
                    src={cover}
                    alt="cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
              {songCovers.length < 3 &&
                Array(3 - songCovers.length)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex-1 h-full rounded"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--color-primary)/0.3), hsl(var(--color-primary-dark)/0.3))`,
                      }}
                    />
                  ))}
            </div>
          ) : (
            <div
              className="h-full w-full flex items-center justify-center rounded"
              style={{
                background: `linear-gradient(135deg, hsl(var(--color-primary)/0.3), hsl(var(--color-primary-dark)/0.3))`,
              }}
            >
              {list.icon ? (
                <i className={`${list.icon} text-3xl text-white/60`}></i>
              ) : (
                <i className="ri-music-2-line text-3xl text-white/50"></i>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-1 line-clamp-1 flex items-center gap-2">
            {list.icon && (
              <i
                className={`${list.icon} text-lg`}
                style={{ color: "hsl(var(--color-primary-light))" }}
              ></i>
            )}
            {list.title}
          </h3>
          <p className="text-xs text-white/60 line-clamp-2 mb-2">{list.description}</p>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {list.createdAt?.split?.("T")[0] || ""}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserListCard;
