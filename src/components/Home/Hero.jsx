import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col items-start justify-center px-0 md:px-4 lg:px-8 xl:px-12 py-8 text-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
        Explora la <span className="text-[hsl(var(--color-primary))]">música</span> que<br />
        define tu <span className="text-[hsl(var(--color-primary))]">identidad musical</span>
      </h1>
      <p className="mt-6 text-lg text-gray-300 max-w-xl">
        Crea, guarda y comparte lo que te representa.
      </p>
      <button className="mt-8 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:from-[hsl(var(--color-primary-light))] hover:to-[hsl(var(--color-primary))] text-white font-medium py-3 px-8 rounded-full transition-all shadow-lg shadow-[hsl(var(--color-primary-dark)/0.3)] hover:shadow-[hsl(var(--color-primary-dark)/0.5)] flex items-center">
        <i className="ri-add-line mr-2"></i>
        <span>Empieza tu viaje Musical</span>
      </button>
    </section>
  );
};

export default Hero;
