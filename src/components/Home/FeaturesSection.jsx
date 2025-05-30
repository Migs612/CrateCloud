import ThemeCustomizer from './ThemeCustomizer';

const FeaturesSection = () => {
  const iconStyles = [
    { icon: 'ri-chat-heart-line', color: '#EC4899' },
    { icon: 'ri-stack-line', color: '#C026D3' },
    { icon: 'ri-user-heart-line', color: '#F9A8D4' },
    { icon: 'ri-compass-discover-line', color: '#06B6D4' },
    { icon: 'ri-fire-line', color: '#FB923C' },
    { icon: 'ri-palette-line', color: '#84CC16' }
  ];

  const features = [
    {
      title: 'Comparte tus opiniones',
      text: 'Publica reseñas personales sobre tus álbumes favoritos, comparte tu interpretación y descubre las opiniones de otros fans sobre la música que amas.'
    },
    {
      title: 'Crea charts personalizados',
      text: 'Construye y personaliza grids de tus álbumes favoritos en formatos 3x3, 4x4 o 5x5 para compartir tus gustos musicales de manera visual y expresiva.'
    },
    {
      title: 'Descubre compatibilidad',
      text: 'Encuentra amigos que comparten tus gustos musicales, recomendaciones personalizadas y descubre tu nivel de compatibilidad basado en tus reseñas.'
    },
    {
      title: 'Explora nuevos sonidos',
      text: 'Descubre música nueva basada en las reseñas de usuarios con gustos similares a los tuyos. Amplía tu horizonte musical con recomendaciones precisas.'
    },
    {
      title: 'Sigue las tendencias',
      text: 'Mantente al día con los álbumes populares, las reseñas más destacadas y las discusiones de actualidad en la comunidad musical de CrateCloud.'
    },
    {
      title: 'Personaliza tu experiencia',
      text: 'Adapta la interfaz a tu estilo con colores basados en tus álbumes favoritos y haz que CrateCloud refleje tu personalidad musical única.'
    }
  ];

  return (
    <section className="py-20 px-4 container mx-auto relative z-10">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold font-unbounded mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-soft))] to-[hsl(var(--color-primary-light))]">
          Descubre tu sonido con CrateCloud
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          La plataforma donde los amantes de la música comparten opiniones, reseñan álbumes y conectan a través de los sonidos que definen su identidad musical.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in"
        style={{ animationDelay: '0.3s' }}
      >
        {features.map(({ title, text }, index) => (
          <div
            key={index}
            className="glass rounded-2xl p-6 transition duration-300 hover:scale-[1.02] border border-[hsl(var(--color-primary)/0.3)] backdrop-blur-lg"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-lg"
              style={{ backgroundColor: iconStyles[index].color }}
            >
              <i className={`${iconStyles[index].icon} text-2xl text-white`}></i>
            </div>
            <h3 className="text-xl font-unbounded font-semibold mb-3 text-white">{title}</h3>
            <p className="text-white/80">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <ThemeCustomizer />
      </div>
    </section>
  );
};

export default FeaturesSection;
