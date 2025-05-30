import React, { useEffect, useState } from 'react';

const CommentSection = ({ targetId, type = 'album' }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (!targetId || !type) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${targetId}?type=${type}`);
        const data = await res.json();

        // Obtener todos los UIDs únicos
        const uniqueUids = [...new Set(data.map((c) => c.userUid))];

        const userInfoMap = {};
        await Promise.all(
          uniqueUids.map(async (uid) => {
            try {
              const resUser = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${uid}`);
              const userData = await resUser.json();
              userInfoMap[uid] = {
                username: userData.username || uid,
                avatar: userData.profileImageUrl || `https://i.pravatar.cc/150?u=${uid}`,
              };
            } catch {
              userInfoMap[uid] = {
                username: uid,
                avatar: `https://i.pravatar.cc/150?u=${uid}`,
              };
            }
          })
        );

        // Combina comentarios con datos del usuario
        const enrichedComments = data.map((c) => ({
          ...c,
          username: userInfoMap[c.userUid].username,
          avatar: userInfoMap[c.userUid].avatar,
        }));

        setComments(enrichedComments);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [targetId, type]);

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Opiniones</h2>

      {loading ? (
        <div className="text-white/50">Cargando comentarios...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-white/40 text-sm">No hay comentarios todavía.</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-800/50 flex-shrink-0">
                <img
                  src={comment.avatar}
                  alt={`Avatar de ${comment.username}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white">{comment.username}</div>
                    <div className="text-white/40 text-xs">{formatDate(comment.createdAt)}</div>
                  </div>
                  <p className="text-white/80">{comment.content}</p>
                  {comment.rating && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <i
                          key={i}
                          className={`text-yellow-400 text-sm ${i <= comment.rating ? 'ri-star-fill' : 'ri-star-line'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
