// ✅ AlbumHeader.jsx (actualizado para imprimir la fuente del texto)
import React, { useEffect, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import useWikipediaSummary from '../../hooks/useWikipediaSummary';
import useLastFmAPI from '../../hooks/useLastFmAPI';
import useTranslatedText from '../../hooks/useTranslatedText';
import toast from 'react-hot-toast';


const AlbumHeader = ({ album, duracionMin, tracks }) => {
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);
  const { color } = useTheme();
  const callLastFm = useLastFmAPI();
  const [isAlbumSaved, setIsAlbumSaved] = useState(false);

  const { summary: wikiSummary, loading: wikiLoading } = useWikipediaSummary(album.name, album.artists?.[0]?.name);
  const translatedLastfm = useTranslatedText(wikiSummary ? null : bio);
  const finalDescription = wikiSummary || translatedLastfm;

  const checkAlbumSaved = async (uid) => {
    try {
      const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
      const lists = await res.json();

      const exists = lists.some(
        (l) =>
          l.type === "album" &&
          l.title === album.name &&
          l.description?.includes(album.artists[0]?.name)
      );

      setIsAlbumSaved(exists);
    } catch (err) {
      console.error("Error verificando si álbum está guardado:", err);
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid || !album?.name || !album.artists?.length) return;

    checkAlbumSaved(uid);
  }, [album]);



  useEffect(() => {
    const image = imgRef.current;
    if (image && image.complete) getColor();
    else if (image) image.addEventListener('load', getColor);

    function getColor() {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(image);
        setBorderColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (e) {
        console.warn('No se pudo obtener color dominante', e);
      }
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.removeEventListener('load', getColor);
      }
    };
  }, [album?.images]);

  useEffect(() => {
    const fetchDescription = async () => {
      if (!album.name || wikiSummary) {
        setLoading(false);
        return;
      }

      const data = await callLastFm('album.getinfo', {
        artist: album.artists[0]?.name,
        album: album.name,
      });

      if (data?.album?.wiki?.content) {
        setBio(data.album.wiki.content);
      }

      setLoading(false);
    };

    fetchDescription();
  }, [album, callLastFm, wikiSummary]);

  const handleSaveAlbum = async () => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    try {
      // 1. Obtener todas las listas del usuario
      const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
      const lists = await res.json();

      // 2. Verificar si ya existe una lista de tipo album con ese título
      const exists = lists.some(
        (l) => l.type === 'album' &&
          l.title === album.name &&
          l.description.includes(album.artists[0]?.name)
      );


      if (exists) {
        toast('Este álbum ya está guardado', { icon: '📀' });
        return;
      }

      // 3. Crear la nueva lista tipo álbum
      const createRes = await fetch(`http://localhost:4000/api/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: uid,
          title: album.name,
          description: `Álbum completo de ${album.artists[0]?.name}`,
          isPrivate: true,
          isDefault: false,
          type: 'album',
          coverImageUrl: album.images[0]?.url || '',
          songIds: tracks.map((t) => t.id),
        }),
      });

      if (!createRes.ok) {
        toast.error('Error al guardar álbum');
        return;
      }

      toast.success('Álbum guardado correctamente');
      setIsAlbumSaved(true);
    } catch (err) {
      console.error(err);
      toast.error('Error inesperado');
    }
  };

  const handleOpenSpotify = () => {
    if (album?.external_urls?.spotify) {
      window.open(album.external_urls.spotify, '_blank');
    }
  };

  const cleanText = (text) => {
    if (typeof text !== 'string') return '';
    return text
      .replace(/<a[^>]*>(.*?)<\/a>/g, '')
      .replace(/Read more on Last\.fm.*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        <div className="animate-float relative">
          <div
            className="absolute inset-0 blur-md opacity-50"
            style={{
              backgroundColor: borderColor,
              transform: 'translate(8px, 8px) scale(0.95)',
            }}
          ></div>
          <img
            ref={imgRef}
            src={album.images[0]?.url}
            alt={album.name}
            crossOrigin="anonymous"
            className="w-48 h-48 md:w-64 md:h-64 object-cover relative z-10"
            style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px ${borderColor}` }}
          />
        </div>

        <div className="flex-1 md:pt-4">
          <div className="text-sm font-medium mb-2 text-white/60">ÁLBUM</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white tracking-tight">{album.name}</h1>
          <p className="text-xl font-bold mb-4 text-white/80">
            {album.artists.map((a, index) => (
              <span key={a.id}>
                <Link
                  to={`/artist/${a.id}`}
                  className="hover:underline hover:text-purple-400 transition-colors"
                >
                  {a.name}
                </Link>
                {index < album.artists.length - 1 && ', '}
              </span>
            ))}
          </p>

          <div className="flex items-center gap-4 my-6">
            <button
              onClick={handleOpenSpotify}
              className="flex items-center gap-2 bg-white hover:bg-white/90 text-black px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 transform active:scale-95"
            >
              <i className="ri-play-fill text-xl"></i> Reproducir
            </button>

            {isAlbumSaved ? (
              <button
                disabled
                className="flex items-center gap-2 bg-purple-800/30 text-purple-300 border border-purple-500/30 px-6 py-3 rounded-full font-bold transition-opacity cursor-default"
              >
                <i className="ri-heart-fill text-xl"></i> Guardado
              </button>
            ) : (
              <button
                onClick={handleSaveAlbum}
                className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 transform active:scale-95"
              >
                <i className="ri-heart-line text-xl"></i> Guardar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <div className="font-semibold text-white/60">Lanzamiento</div>
              <div className="font-medium text-white">{album.release_date}</div>
            </div>
            <div>
              <div className="font-semibold text-white/60">Canciones</div>
              <div className="font-medium text-white">{album.total_tracks}</div>
            </div>
            <div>
              <div className="font-semibold text-white/60">Duración</div>
              <div className="font-medium text-white">{duracionMin} min</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-white/70 leading-relaxed max-w-3xl">
        {loading || wikiLoading ? (
          <p className="text-white/50 text-sm">Cargando...</p>
        ) : finalDescription ? (
          <>
            <p className="first-letter:text-3xl first-letter:font-bold">{cleanText(finalDescription)}</p>
          </>
        ) : (
          <p className="text-white/50 text-sm">No hay información disponible sobre este álbum.</p>
        )}
      </div>
    </div>
  );
};

export default AlbumHeader;
