// src/pages/ArtistPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ColorThief from 'colorthief';

import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';
import useSpotifyAppToken from '../hooks/useSpotifyAppToken';
import { useTheme } from '../context/ThemeContext';

import ArtistHeader from '../components/Artista/ArtistHeader';
import ArtistInfo from '../components/Artista/ArtistInfo';
import TopTracks from '../components/Artista/TopTracks';
import SimilarArtists from '../components/Artista/SimilarArtists';
import CommentSection from '../components/Global/CommentSection';
import ReviewForm from '../components/Global/ReviewForm';
import ArtistLinks from '../components/Artista/ArtistLinks';
import ArtistAlbums from '../components/Artista/ArtistAlbums';
import Listeners from '../components/Artista/Listeners';

const ArtistPage = () => {
  const { id } = useParams();
  const token = useSpotifyAppToken();
  const { setColor } = useTheme();

  const [artistData, setArtistData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [artistRes, tracksRes, albumsRes] = await Promise.all([
          fetch(`https://api.spotify.com/v1/artists/${id}`, { headers }),
          fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`, { headers }),
          fetch(`https://api.spotify.com/v1/artists/${id}/albums?market=ES&include_groups=album,single&limit=9`, { headers }),
        ]);

        if (!artistRes.ok || !tracksRes.ok || !albumsRes.ok) {
          throw new Error('Error al obtener datos de Spotify');
        }

        const artist = await artistRes.json();
        const tracks = await tracksRes.json();
        const albumData = await albumsRes.json();

        setArtistData(artist);
        setTopTracks(tracks.tracks || []);
        setAlbums(albumData.items || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos del artista desde Spotify.');
      }
    };

    fetchData();
  }, [token, id]);

  useEffect(() => {
    if (!artistData?.images?.[0]?.url) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = artistData.images[0].url;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const rgb = colorThief.getColor(img);

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

        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const h = Math.round(hsl[0]);
        const s = Math.round(hsl[1] * 100);
        const l = Math.round(hsl[2] * 100);

        setColor(`${h} ${s}% ${l}%`);
      } catch (e) {
        console.warn('No se pudo obtener el color dominante', e);
      }
    };
  }, [artistData, setColor]);

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10 min-h-screen text-white">{error}</div>
        <Footer />
      </>
    );
  }

  if (!artistData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10 min-h-screen text-white">Cargando artista...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        className="fixed inset-0 -z-10 opacity-60"
        style={{
          background: `radial-gradient(circle at top left, hsl(var(--color-primary, 270 50% 40%)) 0%, transparent 40%),
                       radial-gradient(circle at bottom right, hsl(var(--color-primary, 270 50% 40%)) 0%, transparent 40%)`,
        }}
      />

      <main className="container mx-auto px-4 py-10 space-y-12 animate-fade-in">
        <ArtistHeader
          id={artistData.id}
          name={artistData.name}
          imageUrl={artistData.images?.[0]?.url}
          followers={artistData.followers?.total}
          genres={artistData.genres}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <ArtistInfo artistName={artistData.name} tags={artistData.genres.map(g => ({ name: g }))} />
            <TopTracks tracks={topTracks} artistName={artistData.name} />
            <ArtistAlbums albums={albums} />
            <SimilarArtists artistName={artistData.name} token={token} />
            <Listeners artistId={artistData.id} />
            <CommentSection targetId={artistData.id} type="artist" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <ArtistLinks name={artistData.name} url={artistData.external_urls?.spotify} />
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 rounded-md transition text-white"
            >
              <i className="ri-message-3-line text-lg"></i> Comentar
            </button>
          </div>
        </div>
      </main>

      <Footer />

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
              target={artistData}
              type="artist"
              onClose={() => setShowReviewModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistPage;
