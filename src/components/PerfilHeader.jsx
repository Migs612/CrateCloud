// src/components/PerfilHeader.jsx
import React from 'react';
import AlbumesFavoritos from './AlbumesFavoritos';

const PerfilHeader = () => (
  <div className="bg-purple-800 p-6 rounded-lg w-[80%] mx-auto mt-16 relative">
    {/* Foto de perfil ajustada */}
    <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2">
      <div className="w-32 h-32 rounded-full bg-gray-500 mb-4"></div> {/* Imagen de perfil centrada y elevada */}
    </div>

    {/* Información del usuario */}
    <div className="flex flex-col items-center space-y-2 mt-24">
      <div className="text-2xl font-semibold text-white">Pedritocamela</div>
      <div className="text-sm text-white/70">Est. 28 Feb. 2022</div>
    </div>

    {/* Estadísticas: Más pequeñas y justo debajo del nombre */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center text-sm text-white">
      <div className="p-2">
        <div className="text-xl font-bold">55 394</div>
        <div>Spins</div>
      </div>
      <div className="p-2">
        <div className="text-xl font-bold">3 991</div>
        <div>Artistas</div>
      </div>
      <div className="p-2">
        <div className="text-xl font-bold">11</div>
        <div>Seguidores</div>
      </div>
      <div className="p-2">
        <div className="text-xl font-bold">6</div>
        <div>Favoritos</div>
      </div>
    </div>

    {/* Título de álbumes favoritos debajo de las imágenes */}
    <h2 className="text-lg font-semibold text-white mt-8 text-center">Álbumes favoritos</h2>

    {/* Álbumes favoritos */}
    <AlbumesFavoritos />
  </div>
);

export default PerfilHeader;
