import React from 'react';

const Estadisticas = () => {
  const data = [
    { label: 'Spins', value: '55 394' },
    { label: 'Artistas', value: '3 991' },
    { label: 'Seguidores', value: '11' },
    { label: 'Favoritos', value: '6' },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 text-white text-sm sm:flex sm:flex-row sm:gap-10 sm:text-base">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="text-base font-semibold tracking-wide">{item.label}</div>
          <div className="text-sm opacity-70">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default Estadisticas;
