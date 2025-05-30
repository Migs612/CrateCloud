import { useTheme } from '../../context/ThemeContext';
import { Check, Palette, Sparkles } from 'lucide-react';

const ColorPicker = ({ variant = '1' }) => {
  const { color, setColor } = useTheme();

  const colorOptions = [
    { name: "CrateCloud", subtitle: "Púrpura elegante", via: "292 60% 40%" },
    { name: "Violeta", subtitle: "Púrpura vibrante", via: "308 70% 47%" },
    { name: "Rosa", subtitle: "Rosa intenso", via: "328 86% 50%" },
    { name: "Índigo", subtitle: "Azul profundo", via: "231 48% 45%" },
    { name: "Verde", subtitle: "Esmeralda", via: "174 100% 29%" },
    { name: "Naranja", subtitle: "Fuego cálido", via: "14 100% 57%" },
    { name: "Azul", subtitle: "Océano sereno", via: "200 18% 46%" },
    { name: "Amarillo", subtitle: "Sol radiante", via: "50 100% 50%" },
  ];

  const handleColorSelect = (newColor) => {
    setColor(newColor);
    console.log("Color seleccionado:", newColor);
  };

  if (variant === '2') {
    // Versión simple
    return (
      <div className="backdrop-blur-sm p-5 rounded-lg border border-[hsl(var(--color-primary)/0.3)]">
        <p className="text-sm text-white/80 mb-4 font-medium">Selecciona un tema de color:</p>
        <div className="flex flex-wrap gap-4">
          {colorOptions.map((option, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full shadow-lg transition-all duration-300 ${
                color === option.via
                  ? 'border-2 border-white scale-110 shadow-[0_0_15px_hsl(var(--color-primary-light))]'
                  : 'border border-white/20 hover:scale-105'
              }`}
              style={{
                background: `linear-gradient(135deg, hsl(0 0% 0%), hsl(${option.via}), hsl(0 0% 0%))`
              }}
              onClick={() => handleColorSelect(option.via)}
              title={option.name}
            />
          ))}
        </div>
      </div>
    );
  }

  // Versión extendida (versión 1)
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl rounded-3xl border border-white/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-primary)/0.1)] via-transparent to-[hsl(var(--color-primary)/0.1)] rounded-3xl blur-sm"></div>
      
      <div className="relative p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-[hsl(var(--color-primary)/0.2)] ring-1 ring-[hsl(var(--color-primary)/0.3)]">
            <Palette className="w-5 h-5 text-[hsl(var(--color-primary-light))]" />
          </div>
          <div>
            <h3 className="text-lg font-unbounded font-bold text-white">
              Personaliza tu Tema
            </h3>
            <p className="text-sm text-white/70">
              Elige el color que define tu experiencia musical
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-[hsl(var(--color-primary-light))] ml-auto" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {colorOptions.map((option, index) => {
            const isSelected = color === option.via;
            return (
              <button
                key={index}
                className={`group relative p-4 rounded-2xl transition-all duration-300 border overflow-hidden
                  ${isSelected 
                    ? 'border-white/50 bg-gradient-to-br from-[hsl(var(--color-primary)/0.2)] to-[hsl(var(--color-primary)/0.1)] ring-2 ring-[hsl(var(--color-primary)/0.4)] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5 hover:scale-[1.01]'
                  }`}
                onClick={() => handleColorSelect(option.via)}
                title={`${option.name} - ${option.subtitle}`}
              >
                <div className="absolute inset-0 opacity-10" style={{
                  background: `linear-gradient(135deg, hsl(${option.via}), hsl(${option.via}/0.5))`
                }}></div>

                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl transition-all duration-300 ring-2 ring-offset-2 ring-offset-black/20 ${
                        isSelected ? 'ring-white/60 shadow-lg' : 'ring-white/20 group-hover:ring-white/40'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, hsl(${option.via}), hsl(${option.via}/0.8))`,
                        boxShadow: isSelected ? `0 8px 32px hsl(${option.via}/0.4)` : `0 4px 16px hsl(${option.via}/0.2)`
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {option.name}
                    </div>
                    <div className={`text-xs transition-colors ${isSelected ? 'text-white/80' : 'text-white/60 group-hover:text-white/70'}`}>
                      {option.subtitle}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-primary))] shadow-lg"></div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-primary))] animate-pulse"></div>
          <span className="text-xs text-white/60">Los cambios se aplican instantáneamente</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-primary))] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
