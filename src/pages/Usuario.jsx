import React from 'react';
import Navbar from '../components/Navbar';
import PerfilHeader from '../components/PerfilHeader';
import Footer from '../components/Footer';

const Usuario = () => {
  return (
    <div className="bg-gradient-to-br from-black via-purple-900 to-black text-white min-h-screen overflow-x-hidden">
      <Navbar/> {}
      <PerfilHeader/>
      <Footer/> {}
    </div>
  );
};

export default Usuario;
