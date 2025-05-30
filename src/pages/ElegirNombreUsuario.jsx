import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ElegirNombreUsuario = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { uid, email, displayName } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!uid || !email) {
      setError('Faltan datos. Intenta iniciar sesión nuevamente.');
      return;
    }

    // Validar si el username ya existe
    try {
      const res = await fetch(`http://localhost:4000/api/auth/username-exists/${username}`);
      if (res.status === 200) {
        setError('Este nombre de usuario ya está en uso. Elige otro.');
        return;
      }
    } catch {
      setError('Error al verificar nombre de usuario');
      return;
    }

    // Enviar al backend
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          email: email,
          username: username,
          displayName: username,
        }),
      });

      if (response.ok) {
        navigate('/usuario');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar el usuario');
      }
    } catch (err) {
      setError('Error de red');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-purple-900 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Elige tu nombre de usuario</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-2 mb-4 rounded bg-purple-800 text-white placeholder-purple-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 py-2 rounded text-white font-semibold transition"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ElegirNombreUsuario;
