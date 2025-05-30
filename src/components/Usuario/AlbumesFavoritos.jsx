import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../hooks/firebase';
import useSpotifyAppToken from '../../hooks/useSpotifyAppToken';
import PersonalizarAlbumes from '../Usuario/PersonalizarAlbumes';

const AlbumesFavoritos = () => {
  const token = useSpotifyAppToken();
  const [albums, setAlbums] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const carouselRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const fetchFavoritos = async () => {
      const user = auth.currentUser;
      if (!user || !token) return;

      try {
        const res = await fetch(`http://localhost:4000/api/users/${user.uid}`);
        const data = await res.json();

        const ids = data.favoriteAlbums || [];
        if (ids.length === 0) return setAlbums([]);

        const albumes = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return await response.json();
          })
        );

        setAlbums(albumes);
      } catch (error) {
        console.error('Error al cargar álbumes favoritos:', error);
      }
    };

    fetchFavoritos();
  }, [token, mostrarModal]);

  // Scroll interactivo para móviles
  useEffect(() => {
    const indicator = scrollIndicatorRef.current;
    const carousel = carouselRef.current;

    if (!indicator || !carousel) return;

    const bar = indicator.parentNode;

    let isDragging = false;
    let startX = 0;
    let startLeft = 0;

    const getTransformX = () => {
      const transform = indicator.style.transform;
      const match = transform.match(/translateX\((.*)px\)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const updateScrollIndicator = () => {
      const scrollPercentage = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
      const clamped = Math.max(0, Math.min(1, scrollPercentage));
      const maxX = bar.clientWidth - indicator.clientWidth;
      indicator.style.transform = `translateX(${clamped * maxX}px)`;
    };

    const startDrag = (clientX) => {
      isDragging = true;
      startX = clientX;
      startLeft = getTransformX();
      document.body.classList.add('select-none');
    };

    const moveDrag = (clientX) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      const barWidth = bar.clientWidth - indicator.clientWidth;
      const newLeft = Math.min(Math.max(0, startLeft + dx), barWidth);
      indicator.style.transform = `translateX(${newLeft}px)`;

      const scrollableWidth = carousel.scrollWidth - carousel.clientWidth;
      const scrollPercentage = newLeft / barWidth;
      carousel.scrollLeft = scrollableWidth * scrollPercentage;
    };

    const endDrag = () => {
      isDragging = false;
      document.body.classList.remove('select-none');
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      startDrag(e.clientX);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => moveDrag(e.clientX);
    const onMouseUp = () => {
      endDrag();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    const onTouchStart = (e) => {
      startDrag(e.touches[0].clientX);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    };

    const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
    const onTouchEnd = () => {
      endDrag();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    indicator.addEventListener('mousedown', onMouseDown);
    indicator.addEventListener('touchstart', onTouchStart, { passive: false });
    carousel.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator();

    return () => {
      indicator.removeEventListener('mousedown', onMouseDown);
      indicator.removeEventListener('touchstart', onTouchStart);
      carousel.removeEventListener('scroll', updateScrollIndicator);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [albums]);

  return (
    <div className="mt-4 w-full max-w-6xl mx-auto px-4">
      {mostrarModal && <PersonalizarAlbumes onClose={() => setMostrarModal(false)} />}

      {/* Móviles */}
      <div className="block lg:hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white text-xl font-bold">Álbumes favoritos</div>
          <button
            onClick={() => setMostrarModal(true)}
            className="text-white text-sm border border-white/30 px-3 py-1 rounded hover:bg-white/10 transition"
          >
            Personalizar álbumes
          </button>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 pb-4 overflow-x-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`.carousel::-webkit-scrollbar { display: none; }`}</style>
          {albums.map(album => {
            const imagen = album.images?.[0]?.url || 'default-image.jpg';
            return (
              <div
                key={album.id}
                className="flex-shrink-0 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-lg overflow-hidden bg-white/20 shadow-md"
              >
                <Link to={`/album/${album.id}`}>
                  <img src={imagen} alt={album.name} className="object-cover w-full h-full" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-40 h-1.5 rounded-full bg-white/20 relative overflow-hidden cursor-pointer">
            <div
              ref={scrollIndicatorRef}
              className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-white to-white/70 rounded-full transition-transform duration-150 ease-out"
            ></div>
          </div>
        </div>
      </div>

      {/* Escritorio */}
      <div className="hidden lg:block">
        <div className="w-fit mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="text-white text-xl font-bold">Álbumes favoritos</div>
            <button
              onClick={() => setMostrarModal(true)}
              className="text-white text-sm border border-white/30 px-3 py-1 rounded hover:bg-white/10 transition ml-4"
            >
              Personalizar álbumes
            </button>
          </div>

          <div className="flex items-center flex-nowrap gap-0">
            {albums.map((album, index) => {
              const imagen = album.images?.[0]?.url || 'default-image.jpg';
              return (
                <div
                  key={album.id}
                  className={`relative w-40 h-40 rounded-lg overflow-hidden bg-white/20 shadow-md cursor-pointer ${
                    index !== 0 ? 'ml-[-4rem]' : ''
                  } transition-all duration-300 hover:ml-0 hover:z-50`}
                  style={{ zIndex: albums.length - index }}
                >
                  <Link to={`/album/${album.id}`}>
                    <img src={imagen} alt={album.name} className="object-cover w-full h-full" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumesFavoritos;
