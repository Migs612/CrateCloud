// src/pages/Usuario.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import PerfilHeader from '../components/PerfilHeader';
import Footer from '../components/Footer';

const Usuario = () => {
  return (
    <div className="bg-gradient-to-br from-black via-purple-900 to-black text-white min-h-screen overflow-x-hidden">
      <Navbar /> {/* Navbar con el 80% de ancho */}

        <PerfilHeader />

      <Footer /> {/* Footer con el mismo 80% de ancho */}
    </div>
  );
};

export default Usuario;
