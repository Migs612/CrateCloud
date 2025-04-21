import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSpotifyToken from '../hooks/useSpotifyToken';
import Navbar from '../components/Navbar';
import AlbumHeader from '../components/AlbumHeader';
import TrackList from '../components/TrackList';
import ReviewBox from '../components/ReviewBox';

const Album = () => {
  const { id } = useParams();
  const token = useSpotifyToken();

  const [album, setAlbum] = useState(null);
  const [artistImage, setArtistImage] = useState(null);
  const [mostrarResena, setMostrarResena] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    const fetchAlbumAndArtist = async () => {
      try {
        const resAlbum = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const albumData = await resAlbum.json();
        setAlbum(albumData);

        const artistId = albumData.artists[0]?.id;
        const resArtist = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const artistData = await resArtist.json();

        const artistImg = artistData?.images?.[0]?.url;
        if (artistImg) {
          setArtistImage(artistImg);
        }

      } catch (error) {
        console.error('Error al cargar álbum o artista:', error);
      }
    };

    fetchAlbumAndArtist();
  }, [token, id]);

  if (!album) return <div className="text-white p-10">Cargando álbum...</div>;

  const duracionTotal = album.tracks.items.reduce((acc, t) => acc + t.duration_ms, 0);
  const duracionMin = Math.floor(duracionTotal / 60000);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <div className="relative h-[520px] flex justify-center items-center">
        {artistImage && (
          <div className="w-[80%] h-full mx-auto relative z-0 overflow-hidden">
            <img
              src={artistImage}
              alt="Fondo del artista"
              className="w-full h-full object-contain object-top opacity-30"
            />
          </div>
        )}

        <div className="absolute top-0 left-0 w-full z-10">
          <Navbar />
          <div className="w-[80%] mx-auto mt-32 md:mt-52">
            <AlbumHeader album={album} duracionMin={duracionMin} />
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto py-16 flex flex-col md:flex-row justify-between gap-12 items-start">
        <TrackList tracks={album.tracks.items} />
        <ReviewBox
          mostrarResena={mostrarResena}
          setMostrarResena={setMostrarResena}
        />
      </div>
    </div>
  );
};

export default Album;
