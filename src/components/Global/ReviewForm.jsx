import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

const ReviewForm = ({ target, type = 'album', onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const auth = getAuth();

  const isFormValid = rating > 0 && review.trim().length > 0;

  const getImage = () => {
    if (!target) return null;
    if ((type === 'album' || type === 'artist') && Array.isArray(target.images)) {
      return target.images[0]?.url || null;
    }
    if (type === 'track') {
      return target?.album?.images?.[0]?.url || null;
    }
    if (type === 'user') {
      return target?.avatar || target?.image || null;
    }
    return null;
  };

  const getTitle = () => {
    if (type === 'user') return target?.username || 'Usuario';
    return target?.name || 'Sin título';
  };

  const getSubtext = () => {
    if (type === 'album' || type === 'track') {
      return target?.artists?.map((a) => a.name).join(', ');
    }
    if (type === 'artist') return 'Artista';
    if (type === 'user') return 'Usuario';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setShowPrompt(true);
      return;
    }

    const payload = {
      userUid: user.uid,
      targetId: target.id,
      type,
      content: review,
      rating,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al enviar comentario');

      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al publicar la reseña.');
    }
  };

  const handleRedirectToLogin = () => {
    setShowPrompt(false);
    window.location.href = '/loginPage';
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={getImage() || 'https://via.placeholder.com/100x100?text=?'}
            alt={getTitle()}
            className="w-16 h-16 rounded shadow-md object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{getTitle()}</h3>
            <p className="text-white/70 text-sm">{getSubtext()}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white/90 font-medium mb-2">Tu calificación</label>
          <div className="flex gap-3 py-2 bg-white/5 rounded-xl backdrop-blur-sm justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                className={`text-3xl transition-all hover:scale-110 ${
                  i <= rating ? 'text-yellow-400' : 'text-white/20 hover:text-white/40'
                }`}
              >
                <i className={i <= rating ? 'ri-star-fill' : 'ri-star-line'}></i>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white/90 font-medium mb-2">Tu opinión</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-4 h-28 resize-none focus:outline-none focus:ring-1 ring-white/20"
            placeholder={`Comparte tus pensamientos sobre este ${type === 'track' ? 'tema' : type}...`}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              isFormValid
                ? 'bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-white'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            Publicar reseña
          </button>
        </div>
      </form>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-white">
            <h3 className="text-lg font-bold mb-3">Inicia sesión para comentar</h3>
            <p className="text-white/70 mb-6 text-sm">
              Necesitas estar logueado para publicar tu reseña.
            </p>
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

export default ReviewForm;
