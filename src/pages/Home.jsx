import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Carrusel from '../components/Carrusel';
import UsuariosCompatibles from '../components/UsuariosCompatibles';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-black via-purple-900 to-black text-white min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16">
        <div className="w-full md:w-1/2 relative h-[400px]">
          <Carrusel />
        </div>
        <div className="w-full md:w-1/2">
          <Hero />
        </div>
      </section>

      <div className="px-8 md:px-24 py-12">
        <UsuariosCompatibles />
      </div>
        <Footer />
    </div>
  );
};

export default Home;
