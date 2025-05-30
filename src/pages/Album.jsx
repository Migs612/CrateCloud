// src/pages/Album.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ColorThief from 'colorthief';
import toast from 'react-hot-toast';

import useSpotifyAppToken from '../hooks/useSpotifyAppToken';
import { useTheme } from '../context/ThemeContext';

import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';
import AlbumHeader from '../components/Album/AlbumHeader';
import TrackList from '../components/Album/TrackList';
import SimilarAlbums from '../components/Album/SimilarAlbums';
import CommentSection from '../components/Global/CommentSection';
import ReviewForm from '../components/Global/ReviewForm';

const AlbumPage = () => {
  const { id } = useParams();
  const token = useSpotifyAppToken();
  const { setColor } = useTheme();

  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (!id || !token) return;

    const fetchAlbum = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const albumData = await res.json();
        setAlbum(albumData);

        const trackRes = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const trackData = await trackRes.json();
        setTracks(trackData.items || []);
      } catch (error) {
        console.error('Error al obtener álbum:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, token]);

  useEffect(() => {
    if (album?.images?.[0]?.url) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = album.images[0].url;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const rgb = colorThief.getColor(img);
          const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

          const h = Math.round(hsl[0]);
          const s = Math.round(hsl[1] * 100);
          const l = Math.round(hsl[2] * 100);

          setColor(`${h} ${s}% ${l}%`);
        } catch (e) {
          console.warn('No se pudo obtener el color dominante', e);
        }
      };
    }
  }, [album, setColor]);

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
        default: h = 0; break;
      }
      h /= 6;
    } else {
      s = 0;
    }

    return [h * 360, s, l];
  };

  const duracionMin = Math.ceil(tracks.reduce((acc, t) => acc + t.duration_ms, 0) / 60000);

  if (loading || !album) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Cargando álbum...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Fondo dinámico */}
      <div
        className="fixed inset-0 -z-10 opacity-60"
        style={{
          background: `radial-gradient(circle at top left, hsl(var(--color-primary, 270 50% 40%)) 0%, transparent 40%),
               radial-gradient(circle at bottom right, hsl(var(--color-primary, 270 50% 40%)) 0%, transparent 40%)`,
        }}
      />

      <main className="container mx-auto px-4 py-10 space-y-12 animate-fade-in">
        <AlbumHeader album={album} duracionMin={duracionMin} tracks={tracks} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <TrackList tracks={tracks} />
          </div>

          <div className="lg:col-span-4">
            <div className="glass-rounded p-6 space-y-4 text-white divide-y divide-white/10">
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 rounded-md transition"
              >
                <i className="ri-message-3-line text-lg"></i> Comentar
              </button>
              <button className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 rounded-md transition">
                <i className="ri-add-line text-lg"></i> Añadir a lista
              </button>
              <button
                onClick={async () => {
                  const uid = localStorage.getItem("uid");
                  if (!uid) return;

                  try {
                    const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
                    const lists = await res.json();
                    const listenLater = lists.find((l) => l.type === "listen-later");

                    if (!listenLater) return;

                    const existingIds = new Set(listenLater.songIds);
                    const newTracks = tracks.filter((track) => !existingIds.has(track.id));

                    if (newTracks.length === 0) {
                      toast("Todas las canciones ya estaban en 'Escuchar luego'", { icon: "✔️" });
                      return;
                    }

                    for (const track of newTracks) {
                      await fetch(`http://localhost:4000/api/lists/${listenLater._id}/add-song`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ songId: track.id }),
                      });
                    }

                    toast.success(`${newTracks.length} canción(es) añadidas a 'Escuchar luego'`);
                  } catch (err) {
                    console.error(err);
                    toast.error("Error al añadir canciones");
                  }
                }}
                className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 rounded-md transition"
              >
                <i className="ri-time-line text-lg"></i> Escuchar luego
              </button>
              <button className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 rounded-md transition">
                <i className="ri-share-line text-lg"></i> Compartir
              </button>
            </div>
          </div>
        </div>

        <section className="glass-rounded p-6">
          <h2 className="text-xl font-bold text-white mb-4">Álbumes similares</h2>
          <SimilarAlbums
            artistName={album.artists[0]?.name}
            currentAlbumId={album.id}
            token={token}
          />
        </section>

        <section className="glass-rounded p-6">
          <CommentSection targetId={album.id} type="album" />
        </section>
      </main>

      <Footer />

      {/* Modal de reseña */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/10 rounded-xl max-w-2xl w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
            >
              <i className="ri-close-line"></i>
            </button>
            <ReviewForm
              target={album}
              type="album"
              onClose={() => setShowReviewModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumPage;
