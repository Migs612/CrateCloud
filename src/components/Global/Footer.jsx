const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-[-10] px-4 pt-20 pb-6 rounded-t-3xl text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo-mini.svg" alt="Logo" className="w-6 h-6" />
              <span className="text-xl font-bold font-unbounded">CrateCloud</span>
            </div>
            <p className="text-[hsl(var(--color-primary-soft))] text-sm mb-4">
              Explora, comparte y conecta a través de la música que te define.
            </p>
            <div className="flex space-x-4">
              {['instagram-line', 'twitter-x-line', 'facebook-circle-line', 'discord-line'].map((icon) => (
                <a key={icon} href="#" className="text-[hsl(var(--color-primary-soft))] hover:text-white transition-all">
                  <i className={`ri-${icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-unbounded font-medium mb-4">Navegar</h3>
            <ul className="space-y-2 text-sm">
              {['Inicio', 'Explorar', 'Charts', 'Tendencias', 'Comunidad'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[hsl(var(--color-primary-soft))] hover:text-white transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-unbounded font-medium mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              {['Ayuda', 'Blog', 'API', 'Desarrolladores', 'Estado del servicio'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[hsl(var(--color-primary-soft))] hover:text-white transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-unbounded font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {['Términos de uso', 'Política de privacidad', 'Cookies', 'Licencias', 'Contacto'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[hsl(var(--color-primary-soft))] hover:text-white transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-10 h-0.5 w-full bg-gradient-to-r from-transparent via-[hsl(var(--color-primary)/0.3)] to-transparent"></div>

        <div className="text-center text-sm text-[hsl(var(--color-primary-soft))]">
          <p>&copy; {currentYear} CrateCloud. Todos los derechos reservados.</p>
          <p className="text-xs mt-2 text-[hsl(var(--color-primary-soft)/0.8)] italic">
            Hecho con <span className="text-[hsl(var(--color-primary))]">♥</span> por estudiantes apasionados por la música.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
