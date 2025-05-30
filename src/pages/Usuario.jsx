import React, { useEffect, useState } from 'react';
import { auth } from '../hooks/firebase';
import PerfilHeader from '../components/Usuario/PerfilHeader';
import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';

const Usuario = () => {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20 text-lg animate-pulse">
        Cargando sesión...
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="text-white text-center py-20 text-lg">
        Debes iniciar sesión para ver tu perfil.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          backgroundImage: 'var(--background-dynamic)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '300% 300%',
          backgroundAttachment: 'fixed',
          animation: 'fondo-move 10s ease-in-out infinite, fondo-pulso 12s ease-in-out infinite'
        }}
      />

      <Navbar />
      <div className="flex-grow relative z-10">
        <PerfilHeader uid={uid} />
      </div>
      <Footer />
    </div>
  );
};

export default Usuario;
