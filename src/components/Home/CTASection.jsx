const CTASection = () => {
  return (
    <section className="py-28 px-4 container mx-auto relative z-10 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold font-unbounded leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-light))] via-white to-[hsl(var(--color-primary-soft))] mb-6">
          Comienza a crear tu identidad musical
        </h2>

        <p className="text-xl text-[rgba(255,255,255,0.8)] mb-12 leading-relaxed">
          Únete a miles de amantes de la música que ya están compartiendo sus gustos musicales y descubriendo nuevos sonidos.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button className="bg-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:brightness-110 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-lg shadow-[hsl(var(--color-primary-dark)/0.3)] hover:shadow-[hsl(var(--color-primary-dark)/0.4)] transform hover:scale-105">
            Registrarse gratis
          </button>
          <button className="border border-[hsl(var(--color-primary)/0.3)] hover:border-[hsl(var(--color-primary)/0.5)] hover:bg-[hsl(var(--color-primary)/0.1)] text-white font-semibold py-4 px-10 rounded-full transition-all transform hover:scale-105">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-primary-light))] to-[hsl(var(--color-primary-soft))]">
              Conocer más
            </span>
          </button>
        </div>

        <div className="mt-12 inline-block">
          <div className="glass-rounded py-2 px-5 text-xs border border-[hsl(var(--color-primary)/0.3)] text-[hsl(var(--color-primary-soft))] flex items-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse mr-2"
              style={{ backgroundColor: 'hsl(var(--color-primary))' }}
            ></div>
            Lanzamiento exclusivo 2025
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
