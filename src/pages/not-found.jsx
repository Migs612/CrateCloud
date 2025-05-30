import { Link } from "react-router-dom";
import { Home, Search, Music } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ColorPicker from "../components/Global/ColorPicker";
import Navbar from "../components/Global/Navbar";

const NotFound = () => {
  const { color } = useTheme();

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Fondo con degradado dinámico */}
      {/* Navbar con prioridad visual */}
    <div className="relative z-50">
      <Navbar />
    </div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, hsl(${color}/0.1), transparent 60%),
                       radial-gradient(ellipse at 80% 70%, hsl(${color}/0.15), transparent 60%)`
        }}
      />
      
      {/* Partículas flotantes animadas */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2">
        {/* Contenedor principal */}
        <div className="text-center max-w-lg mx-auto">
          {/* 404 con vinilo girando */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            <span className="text-8xl md:text-9xl font-bold text-white">4</span>
            
            {/* Vinilo animado */}
            <div className="relative">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full animate-spin border-4 border-white/20"
                style={{
                  background: `radial-gradient(circle at center, 
                    hsl(${color}) 0%, 
                    hsl(${color}/0.8) 20%, 
                    #1a1a1a 21%, 
                    #1a1a1a 30%, 
                    hsl(${color}/0.6) 31%, 
                    hsl(${color}/0.6) 35%, 
                    #1a1a1a 36%, 
                    #1a1a1a 65%, 
                    hsl(${color}/0.4) 66%, 
                    hsl(${color}/0.4) 70%, 
                    #0a0a0a 71%)`,
                  animationDuration: '3s',
                  animationTimingFunction: 'linear'
                }}
              >
                {/* Centro del vinilo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-black rounded-full border border-white/30" />
                
                {/* Surcos del vinilo */}
                <div className="absolute inset-2 rounded-full border border-white/10" />
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <div className="absolute inset-6 rounded-full border border-white/10" />
              </div>
              
              {/* Brazo/tocadiscos */}
              <div 
                className="absolute -right-2 top-1/2 w-8 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform -translate-y-1/2 rotate-12"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
            
            <span className="text-8xl md:text-9xl font-bold text-white">4</span>
          </div>

          {/* Mensaje de error */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Parece que este track se perdió en el mix
            </h1>
            <p className="text-lg text-white/70 mb-6">
              Vamos a encontrar algo mejor.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <Home size={20} />
              <span>Volver al inicio</span>
            </Link>
            
            <Link
              to="/Albums"
              className="group flex items-center justify-center gap-2 px-6 py-3 text-white rounded-full border-2 transition-all duration-300 hover:scale-105"
              style={{
                borderColor: `hsl(${color})`,
                background: `hsl(${color}/0.1)`,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `hsl(${color}/0.2)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = `hsl(${color}/0.1)`;
              }}
            >
              <Search size={20} />
              <span>Explorar álbumes</span>
            </Link>
          </div>

          {/* Sugerencias adicionales */}
          <div className="text-center">
            <p className="text-white/50 text-sm mb-4">
              ¿Buscabas algo específico? Intenta con:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/lists"
                className="px-3 py-1 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                Tus listas
              </Link>
              <Link
                to="/amigos"
                className="px-3 py-1 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                Amigos
              </Link>
              <Link
                to="/usuario"
                className="px-3 py-1 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                Tu perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Decoración inferior (si se quiere añadir algo) */}
      </div>
    </div>
    </>
  );
};

export default NotFound;
