import React, { useEffect, useState } from 'react';
import AlbumesFavoritos from './AlbumesFavoritos';
import Estadisticas from './Estadisticas';
import useLastFmAPI from '../hooks/useLastFmAPI';

const PerfilHeader = () => {
  const [username] = useState('Hadesito');
  const [userImage, setUserImage] = useState('');
  const callLastFm = useLastFmAPI();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await callLastFm('user.getInfo', { user: username });
        if (data?.user?.image) {
          const imageUrl = data.user.image[data.user.image.length - 1]['#text'];
          setUserImage(imageUrl);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [username, callLastFm]);

  return (
    <div className="relative w-[80%] mx-auto mt-12">
      {/* Imagen y nombre solo en desktop */}
      <div className="hidden lg:flex items-center space-x-4 mb-0 relative z-10 ml-6">
        <div
          className="w-48 h-48 rounded-full shadow-xl"
          style={{
            backgroundImage: `url(${userImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          }}
        ></div>

        <div className="text-white -mt-13">
          <div className="text-3xl font-semibold">{username}</div>
          <div className="text-sm text-white/70">Est. 28 Feb, 2022</div>
        </div>
      </div>

      {/* Recuadro principal (ajustado solo padding superior en móvil) */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-lg mt-10 lg:mt-[-4rem] pt-36 lg:pt-28 relative z-0">
        {/* Imagen centrada en mobile */}
        <div className="lg:hidden flex justify-center relative">
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-xl absolute -top-20"
            style={{
              backgroundImage: `url(${userImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          ></div>
        </div>

        {/* Nombre en mobile */}
        <div className="lg:hidden text-white text-center mt-16">
          <div className="text-2xl font-semibold">{username}</div>
          <div className="text-sm text-white/70">Est. 28 Feb, 2022</div>
        </div>

        {/* Estadísticas: alineadas en desktop, centradas en mobile */}
        <div className="lg:ml-[13rem] mt-6 lg:mt-[-6rem] flex justify-center lg:justify-start">
          <Estadisticas />
        </div>

        {/* Álbumes favoritos */}
        <div className="mt-8 flex flex-col items-center">
          <AlbumesFavoritos />
        </div>
      </div>
    </div>
  );
};

export default PerfilHeader;
