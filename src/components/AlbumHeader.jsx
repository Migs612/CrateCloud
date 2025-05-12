import React, { useEffect, useRef, useState } from 'react';
import ColorThief from 'colorthief';

const AlbumHeader = ({ album, duracionMin }) => {
  const [borderColor, setBorderColor] = useState('#ffffff');
  const imgRef = useRef(null);

  useEffect(() => {
    const image = imgRef.current;
    if (image && image.complete) {
      getColor();
    } else if (image) {
      image.addEventListener('load', getColor);
    }

    function getColor() {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(image);
        setBorderColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (e) {
        console.warn("No se pudo obtener color dominante", e);
      }
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.removeEventListener('load', getColor);
      }
    };
  }, [album.images]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 md:gap-6 p-0 md:p-0 text-white items-start">
        {/* Portada sin esquinas redondeadas */}
        <img
          ref={imgRef}
          src={album.images[0]?.url}
          alt={album.name}
          crossOrigin="anonymous"
          className="w-40 h-40 md:w-48 md:h-48 object-cover"
          style={{ border: `1px solid ${borderColor}` }}
        />

        {/* Info + descripción alineadas */}
        <div className="flex flex-col md:flex-row justify-start w-full gap-4">
          {/* Info principal */}
          <div className="flex-1 mt-1 max-w-[500px]">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{album.name.toUpperCase()}</h1>
            <p className="text-purple-300 mb-2">{album.artists.map(a => a.name).join(', ')}</p>
            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-purple-400 transition text-sm mb-4">
              ▶ Escuchar álbum
            </button>
            <div className="text-sm text-gray-200 space-y-1">
              <p>Duración: {duracionMin} min</p>
              <p>Lanzamiento: {album.release_date}</p>
              <p>Total de canciones: {album.total_tracks}</p>
            </div>
          </div>

          <div className="text-sm text-gray-200 self-center md:pt-2 max-w-[500px]">
            <p>
              Este álbum es una obra representativa de su género, con un enfoque artístico único. 
              Explora sonidos que han marcado generaciones y redefinido estilos. {album.name.toUpperCase()} 
              ha sido aclamado por la crítica y adorado por fans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumHeader;
