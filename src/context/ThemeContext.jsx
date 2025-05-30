import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [color, setColor] = useState(
    localStorage.getItem('theme-color') || '292 60% 40%' // púrpura por defecto
  );

  useEffect(() => {
    if (!color) return;

    const [h, s, lStr] = color.split(' ');
    const l = parseInt(lStr.replace('%', ''), 10);
    const isLight = l > 60;

    // 🎨 Contraste fuerte con efecto de sombra real
    const soft = `${h} ${s} ${isLight ? Math.max(l - 30, 0) + '%' : Math.min(l + 10, 100) + '%'}`;
    const base = `${h} ${s} ${isLight ? Math.max(l - 45, 0) + '%' : Math.min(l + 5, 100) + '%'}`;
    const dark = `${h} ${s} ${isLight ? Math.max(l - 60, 0) + '%' : Math.max(l - 10, 0) + '%'}`;
    const solid = `${h} ${s} ${Math.max(l, 35)}%`;
    const contrast = `${h} ${s} 95%`;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', color);
    root.style.setProperty('--color-primary-light', soft);
    root.style.setProperty('--color-primary-soft', soft);
    root.style.setProperty('--color-primary-contrast', contrast);
    root.style.setProperty('--color-primary-dark', dark);
    root.style.setProperty('--color-primary-solid', solid);

    // 🌌 Fondo dinámico con contraste real
    root.style.setProperty(
      '--background-dynamic',
      `radial-gradient(circle at 25% 25%, hsl(${dark}) 0%, transparent 50%),
       radial-gradient(circle at 75% 75%, hsl(${base}) 0%, transparent 60%),
       radial-gradient(circle at 50% 50%, hsl(0 0% 0% / 0.04), transparent 70%)`
    );

    localStorage.setItem('theme-color', color);
  }, [color]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
