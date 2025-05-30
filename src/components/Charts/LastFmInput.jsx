// src/components/Chart/LastFmInput.jsx
import React from 'react';

const LastFmInput = ({ username, setUsername }) => {
  return (
    <div className="glass-panel p-4 rounded-lg max-w-md mx-auto">
      <label className="block text-sm text-white/70 mb-2 font-medium">
        Usuario de Last.fm
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ej. tuUsuarioLastFm"
        className="w-full bg-white/10 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="text-xs text-white/50 mt-2">
        Se usará para obtener tus álbumes más escuchados.
      </p>
    </div>
  );
};

export default LastFmInput;
