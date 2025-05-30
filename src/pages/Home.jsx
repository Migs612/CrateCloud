// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Global/Navbar';
import Hero from '../components/Home/Hero';
import Carrusel from '../components/Home/Carrusel';
import PopularAlbumsSection from '../components/Home/PopularAlbumsSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import ChartCreatorSection from '../components/Home/ChartCreatorSection';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Global/Footer';

const Home = () => {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
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

      <div className="relative z-10">
        <Navbar />
        <section className="relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-24 py-16">
            <div className="w-full md:w-1/2">
              <Carrusel />
            </div>
            <div className="w-full md:w-1/2">
              <Hero />
            </div>
          </div>
        </section>
        <PopularAlbumsSection />
        <FeaturesSection />
        <ChartCreatorSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
