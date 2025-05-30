import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useLastFmAPI from '../../hooks/useLastFmAPI';

const PopularAlbumsSection = () => {
  const [albums, setAlbums] = useState([]);
  const carouselRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const callLastFm = useLastFmAPI();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const topTracksData = await callLastFm('chart.gettoptracks', { limit: 50 });
        if (!topTracksData?.tracks?.track) return;

        const tracks = topTracksData.tracks.track;
        const artistNames = Array.from(new Set(tracks.map(track => track.artist.name)));
        const albumSet = new Map();

        for (const artist of artistNames) {
          const albumsData = await callLastFm('artist.gettopalbums', { artist, limit: 5 });
          const topAlbums = albumsData?.topalbums?.album || [];
          const album = topAlbums.find(a => a.name && a.artist?.name && a.image?.[2]?.['#text']);
          if (album && !albumSet.has(artist)) {
            albumSet.set(artist, {
              title: album.name,
              artist: album.artist.name,
              cover: album.image[2]['#text'],
            });
          }
          if (albumSet.size >= 8) break;
        }

        setAlbums(Array.from(albumSet.values()));
      } catch (err) {
        console.error('Error al obtener álbumes desde Last.fm:', err);
      }
    };

    fetchAlbums();
  }, [callLastFm]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    if (carousel) {
      const disableSelection = () => document.body.classList.add('select-none');
      const enableSelection = () => document.body.classList.remove('select-none');

      const updateScrollIndicator = () => {
        if (carousel && scrollIndicator) {
          const scrollPercentage = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
          const clamped = Math.max(0, Math.min(1, scrollPercentage));
          const maxX = scrollIndicator.parentNode.clientWidth - scrollIndicator.clientWidth;
          scrollIndicator.style.transform = `translateX(${clamped * maxX}px)`;
        }
      };

      const down = (e) => {
        isDown = true;
        disableSelection();
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      };

      const move = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
        updateScrollIndicator();
      };

      const upOrLeave = () => {
        if (isDown) {
          isDown = false;
          enableSelection();
          carousel.style.cursor = 'grab';
        }
      };

      carousel.addEventListener('mousedown', down);
      carousel.addEventListener('mouseleave', upOrLeave);
      carousel.addEventListener('mouseup', upOrLeave);
      carousel.addEventListener('mousemove', move);
      carousel.addEventListener('scroll', updateScrollIndicator);
      updateScrollIndicator();

      return () => {
        carousel.removeEventListener('mousedown', down);
        carousel.removeEventListener('mouseleave', upOrLeave);
        carousel.removeEventListener('mouseup', upOrLeave);
        carousel.removeEventListener('mousemove', move);
        carousel.removeEventListener('scroll', updateScrollIndicator);
        enableSelection();
      };
    }
  }, []);

  // 🆕 Nuevo useEffect para hacer interactiva la barra de scroll personalizada
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

    // Mouse events
    const onMouseDown = (e) => {
      e.preventDefault();
      startDrag(e.clientX);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      e.preventDefault();
      moveDrag(e.clientX);
    };

    const onMouseUp = () => {
      endDrag();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    // Touch events
    const onTouchStart = (e) => {
      startDrag(e.touches[0].clientX);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    };

    const onTouchMove = (e) => {
      moveDrag(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      endDrag();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    // Add listeners
    indicator.addEventListener('mousedown', onMouseDown);
    indicator.addEventListener('touchstart', onTouchStart, { passive: false });

    return () => {
      indicator.removeEventListener('mousedown', onMouseDown);
      indicator.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section className="py-20 px-4 container mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-unbounded mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-soft))] to-[hsl(var(--color-primary-light))]">
            Álbumes populares
          </h2>
          <p className="text-sm text-[hsl(var(--color-primary-soft)/0.7)]">
            Basado en el ranking global de Last.fm
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-[hsl(var(--color-primary)/0.15)] hover:bg-[hsl(var(--color-primary)/0.25)] text-white font-medium py-2 px-6 rounded-full flex items-center transition-all border border-[hsl(var(--color-primary)/0.3)]">
          Ver todos <i className="ri-arrow-right-line ml-2"></i>
        </button>
      </div>

      <div
        ref={carouselRef}
        className="carousel flex space-x-6 overflow-x-auto pb-10 snap-x"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            .carousel::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {albums.map((album, index) => (
          <Link
            key={index}
            to={`/album-preview?artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.title)}`}
            className="album-card snap-start flex-shrink-0 w-48 md:w-60 glass rounded-xl overflow-hidden shadow-lg shadow-[hsl(var(--color-primary)/0.1)] border border-white/5 backdrop-blur-lg transition-transform hover:scale-105"
          >
            <div className="relative">
              <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-white truncate">{album.title}</h3>
              <p className="text-sm text-white/70 truncate">{album.artist}</p>
              <div className="mt-2 flex items-center text-xs text-[hsl(var(--color-primary-soft)/0.7)]">
                <i className="ri-heart-line mr-1"></i>
                <span>{Math.floor(Math.random() * 5000) + 1000}</span>
                <span className="mx-2">•</span>
                <i className="ri-play-circle-line mr-1"></i>
                <span>{Math.floor(Math.random() * 100) + 10}K</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <div className="w-40 h-1.5 rounded-full bg-[hsl(var(--color-primary)/0.2)] relative overflow-hidden cursor-pointer">
          <div
            ref={scrollIndicatorRef}
            className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-light))] rounded-full transition-transform duration-150 ease-out"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default PopularAlbumsSection;
