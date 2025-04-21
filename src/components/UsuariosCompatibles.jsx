import React from 'react';

const usuarios = [
  { nombre: 'Manu', compatibilidad: 87 },
  { nombre: 'Martina', compatibilidad: 92 },
  { nombre: 'Pedro', compatibilidad: 78 },
  { nombre: 'Clara', compatibilidad: 95 },
];

const UsuariosCompatibles = () => {
  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-semibold mb-6">Usuarios compatibles contigo</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {usuarios.map((usuario, index) => (
          <div
            key={index}
            className="bg-purple-800/20 backdrop-blur-md p-4 rounded-xl shadow-md text-center hover:bg-purple-700/30 transition"
          >
            <div className="text-lg font-medium">{usuario.nombre}</div>
            <div className="text-sm text-purple-300 mt-2">
              💜 {usuario.compatibilidad}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsuariosCompatibles;
