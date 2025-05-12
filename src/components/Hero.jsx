import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col items-start justify-center px-0 md:px-4 lg:px-8 xl:px-12 py-8 text-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
        Explora la <span className="text-purple-400">música</span> que<br />
        define tu <span className="text-purple-300">identidad musical</span>
      </h1>
      <p className="mt-6 text-lg text-gray-300 max-w-xl">
        Crea, guarda y comparte lo que te representa.
      </p>
      <button className="mt-8 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium text-lg rounded-full shadow-lg transition">
        Empieza tu viaje musical
      </button>
    </section>
  );
};

export default Hero;
