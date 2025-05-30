import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSpotifyAppToken from '../hooks/useSpotifyAppToken';

const AlbumPreview = () => {
  const [searchParams] = useSearchParams();
  const artist = searchParams.get('artist');
  const album = searchParams.get('album');
  const token = useSpotifyAppToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpotifyIdAndRedirect = async () => {
      if (!artist || !album || !token) return;

      try {
        const query = encodeURIComponent(`album:${album} artist:${artist}`);
        const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const id = data?.albums?.items?.[0]?.id;

        if (id) {
          navigate(`/album/${id}`);
        } else {
          console.warn('Álbum no encontrado en Spotify');
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Error buscando el álbum en Spotify:', error);
        navigate('/not-found');
      }
    };

    fetchSpotifyIdAndRedirect();
  }, [artist, album, token, navigate]);

  return (
    <div className="text-white p-10">
      Buscando álbum en Spotify...
    </div>
  );
};

export default AlbumPreview;
