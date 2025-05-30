import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const FollowButton = ({ targetId, targetType = 'artist' }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const checkFollowing = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/check-following`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, targetId, targetType }),
        });
        const data = await res.json();
        setIsFollowing(data.following);
      } catch (err) {
        console.error('Error comprobando seguimiento:', err);
      }
    };

    checkFollowing();
  }, [targetId, targetType]);

  const toggleFollow = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setShowPrompt(true);
      return;
    }

    if (loading) return;
    setLoading(true);

    const endpoint = isFollowing ? 'unfollow' : 'follow';
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, targetId, targetType }),
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error(`Error al ${endpoint}`);
      }
    } catch (err) {
      console.error('Error en toggleFollow:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    setShowPrompt(false);
    window.location.href = '/loginPage';
  };

  return (
    <>
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`border border-white/20 px-4 py-1.5 rounded-lg text-sm transition ${
          isFollowing ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white'
        }`}
      >
        {loading ? 'Cargando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
      </button>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-white">
            <h3 className="text-lg font-bold mb-3">Inicia sesión para seguir</h3>
            <p className="text-white/70 mb-6 text-sm">Necesitas estar logueado para seguir a un artista o usuario.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedirectToLogin}
                className="px-4 py-2 rounded bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-white text-sm font-semibold"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowButton;