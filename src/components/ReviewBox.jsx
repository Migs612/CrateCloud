import React from 'react';

const ReviewBox = ({ mostrarResena, setMostrarResena }) => {
  return (
    <div className="border border-white p-4 rounded w-full md:max-w-xs self-start md:ml-auto">
      <h3 className="text-md font-semibold mb-3">Califica</h3>
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} className="text-xl cursor-pointer hover:text-purple-400">☆</span>
        ))}
      </div>

      <div className="space-y-2">
        {!mostrarResena && (
          <button
            onClick={() => setMostrarResena(true)}
            className="w-full border border-white py-2 text-sm rounded text-white hover:bg-white/10 transition"
          >
            Deja tu reseña...
          </button>
        )}

        {mostrarResena && (
          <textarea
            className="w-full border border-white bg-transparent text-sm text-white rounded p-2"
            placeholder="Deja tu reseña o comentario..."
          />
        )}

        <button className="w-full border border-white py-2 text-sm rounded text-white hover:bg-white/10 transition">
          ➕ Añádelo a tu lista...
        </button>
        <button className="w-full border border-white py-2 text-sm rounded text-white hover:bg-white/10 transition">
          ⏱ Escuchar luego
        </button>
        <button className="w-full border border-white py-2 text-sm rounded text-white hover:bg-white/10 transition">
          🔗 Compartir
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-3">
        Calificación promedio: <span className="text-white">4.5 ★</span>
      </p>
    </div>
  );
};

export default ReviewBox;
