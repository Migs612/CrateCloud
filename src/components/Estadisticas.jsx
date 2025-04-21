// src/components/Estadisticas.jsx
import React from 'react';

const Estadisticas = () => {
  const data = [
    { label: 'Spins', value: '55 394' },
    { label: 'Artistas', value: '3 991' },
    { label: 'Seguidores', value: '11' },
    { label: 'Favoritos', value: '6' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm text-white">
      {data.map((item, i) => (
        <div key={i} className="bg-white/10 p-4 rounded-lg">
          <div className="text-xl font-bold">{item.value}</div>
          <div>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Estadisticas;
