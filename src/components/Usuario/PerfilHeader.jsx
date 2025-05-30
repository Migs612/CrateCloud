import React, { useEffect, useState, useRef } from 'react';
import AlbumesFavoritos from './AlbumesFavoritos';
import Estadisticas from './Estadisticas';
import BotonesConexiones from './BotonesConexiones';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../hooks/firebase';

const PerfilHeader = ({ uid }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/${uid}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uid) return;

    try {
      const imageRef = ref(storage, `avatars/${uid}/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      await fetch(`http://localhost:4000/api/users/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImageUrl: imageUrl }),
      });

      setUserData(prev => ({ ...prev, profileImageUrl: imageUrl }));
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const userImage = userData?.profileImageUrl || '/default-profile.png';

  if (loading || !userData) {
    return (
      <div className="w-[80%] mx-auto mt-12 animate-pulse text-white">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 rounded-full bg-white/10" />
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-48 bg-white/10 rounded" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg mt-10">
          <div className="h-6 w-32 bg-white/10 rounded mb-4" />
          <div className="flex gap-6">
            <div className="w-24 h-10 bg-white/10 rounded" />
            <div className="w-24 h-10 bg-white/10 rounded" />
            <div className="w-24 h-10 bg-white/10 rounded" />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-28 h-28 bg-white/10 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[80%] mx-auto mt-12">
      {/* Desktop */}
      <div className="hidden lg:flex items-center space-x-4 mb-0 relative z-10 ml-6">
        <div
          className="w-48 h-48 rounded-full shadow-xl cursor-pointer"
          style={{
            backgroundImage: `url(${userImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          }}
          onClick={handleImageClick}
          title="Haz clic para cambiar la imagen"
        ></div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <div className="text-white -mt-13">
          <div className="text-3xl font-semibold flex items-center gap-4">
            {userData?.username}
            <BotonesConexiones
              spotify={userData?.spotify}
              lastfm={userData?.lastfm}
            />
          </div>
          <div className="text-sm text-white/70">Est. 28 Feb, 2022</div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-lg mt-10 lg:mt-[-4rem] pt-36 lg:pt-28 relative z-0">
        {/* Mobile */}
        <div className="lg:hidden flex justify-center relative">
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-xl absolute -top-20 cursor-pointer"
            style={{
              backgroundImage: `url(${userImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            onClick={handleImageClick}
            title="Haz clic para cambiar la imagen"
          ></div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Nombre en mobile */}
        <div className="lg:hidden text-white text-center mt-16">
          <div className="text-2xl font-semibold flex flex-col items-center gap-1">
            {userData?.username}
            <BotonesConexiones
              spotify={userData?.spotify}
              lastfm={userData?.lastfm}
            />
          </div>
          <div className="text-sm text-white/70">Est. 28 Feb, 2022</div>
        </div>

        <div className="lg:ml-[13rem] mt-6 lg:mt-[-6rem] flex justify-center lg:justify-start">
          <Estadisticas />
        </div>

        <div className="mt-8 flex flex-col items-center">
          <AlbumesFavoritos />
        </div>
      </div>
    </div>
  );
};

export default PerfilHeader;
