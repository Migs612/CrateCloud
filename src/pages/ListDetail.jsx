import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Global/Navbar";
import useSpotifyAppToken from "../hooks/useSpotifyAppToken";
import EditListModal from "../components/Lists/EditListModal";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../hooks/firebase";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ListDetail = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingSongs, setIsEditingSongs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [songToRemove, setSongToRemove] = useState(null);

  const spotifyToken = useSpotifyAppToken();

  const toggleEditSongsMode = () => {
    setIsEditingSongs(!isEditingSongs);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const searchTracks = async () => {
      if (!searchQuery.trim() || !spotifyToken) return;

      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=6`,
          {
            headers: {
              Authorization: spotifyToken.startsWith("Bearer ")
                ? spotifyToken
                : `Bearer ${spotifyToken}`,
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data.tracks.items)) {
          const results = data.tracks.items.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            cover: track.album.images?.[0]?.url || "",
          }));
          setSearchResults(results);
        }
      } catch (err) {
        console.error("Error al buscar canciones en Spotify:", err);
      }
    };

    const delayDebounce = setTimeout(searchTracks, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, spotifyToken]);

  const handleAddSong = async (songId) => {
    // ✅ Evitar añadir canciones duplicadas
    if (list.songIds.includes(songId)) return;

    try {
      const res = await fetch(`http://localhost:4000/api/lists/${list._id}/add-song`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });

      if (!res.ok) throw new Error("Error al añadir canción");

      // ✅ Actualiza la lista localmente
      const updatedSongIds = [...list.songIds, songId];
      setList((prev) => ({ ...prev, songIds: updatedSongIds }));

      // ✅ Refrescar las canciones visualmente (cargando desde Spotify)
      const resSpotify = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
        headers: {
          Authorization: spotifyToken.startsWith("Bearer ")
            ? spotifyToken
            : `Bearer ${spotifyToken}`,
        },
      });

      const song = await resSpotify.json();

      let likes = 0;
      try {
        const likeRes = await fetch(`http://localhost:4000/api/songs/${song.id}/likes`);
        const likeData = await likeRes.json();
        likes = likeData.count || 0;
      } catch (err) {
        console.warn("No se pudo obtener likes para", song.id);
      }

      const newSong = {
        id: song.id,
        title: song.name,
        artist: song.artists.map((a) => a.name).join(", "),
        cover: song.album.images?.[0]?.url || "",
        year: new Date(song.album.release_date).getFullYear(),
        likes,
        albumId: song.album.id,
      };

      setAlbums((prev) => [...prev, newSong]);

      // ✅ Limpia la barra de búsqueda
      toast.success("Canción añadida con éxito");
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error al añadir canción:", err);
    }
  };

  const confirmRemoveSong = (songId) => {
    setSongToRemove(songId);
  };

  const handleRemoveSong = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/lists/${list._id}/remove-song`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: songToRemove }),
      });

      if (!res.ok) throw new Error("Error al quitar canción");

      setList((prev) => ({
        ...prev,
        songIds: prev.songIds.filter((id) => id !== songToRemove),
      }));
      setAlbums((prev) => prev.filter((a) => a.id !== songToRemove));
      setSongToRemove(null);
      toast.success("Canción eliminada");
    } catch (err) {
      console.error("Error al quitar canción:", err);
      toast.error("Error al quitar canción");
    }
  };

  const handleLike = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid || !list?._id) return;

    try {
      const res = await fetch(`http://localhost:4000/api/likes`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, listId: list._id }),
      });

      if (!res.ok) throw new Error("Error al actualizar el like");

      // Actualiza estado local
      setIsLiked(!isLiked);
      setList((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + (isLiked ? -1 : 1),
      }));
    } catch (err) {
      console.error("Error al dar/quitar like:", err);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/lists/${id}`);
        if (!res.ok) throw new Error("Error al obtener la lista");
        const data = await res.json();

        setList(data);
        setIsOwner(data.userUid === localStorage.getItem("uid"));

        if (data.isPrivate && data.userUid !== localStorage.getItem("uid")) {
          setList(null); // vacía la lista
          toast.error("Esta lista es privada");
          return;
        }


        const uid = localStorage.getItem("uid");

        // Verifica si ya dio like
        try {
          const resLike = await fetch(`http://localhost:4000/api/likes/exists?uid=${uid}&listId=${data._id}`);
          const likeData = await resLike.json();
          setIsLiked(likeData.liked);
        } catch (err) {
          console.warn("Error verificando like:", err);
        }

        // Contar likes totales de la lista
        try {
          const countRes = await fetch(`http://localhost:4000/api/likes/count/${data._id}`);
          const countData = await countRes.json();
          setList((prev) => ({ ...prev, likes: countData.count }));
        } catch (err) {
          console.warn("Error contando likes:", err);
        }

        try {
          const resLike = await fetch(`http://localhost:4000/api/likes/exists?uid=${uid}&listId=${data._id}`);
          const likeData = await resLike.json();
          setIsLiked(likeData.liked);
        } catch (err) {
          console.warn("No se pudo verificar si ya dio like:", err);
        }

        // Cargar canciones desde Spotify
        if (Array.isArray(data.songIds) && data.songIds.length > 0 && spotifyToken) {
          const fetchedAlbums = await Promise.all(
            data.songIds.map(async (songId) => {
              try {
                const res = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
                  headers: { Authorization: `Bearer ${spotifyToken}` },
                });
                const song = await res.json();
                const likeRes = await fetch(`http://localhost:4000/api/songs/${song.id}/likes`);
                const likeData = await likeRes.json();

                return {
                  id: song.id,
                  title: song.name,
                  artist: song.artists.map((a) => a.name).join(", "),
                  cover: song.album.images?.[0]?.url || "",
                  year: new Date(song.album.release_date).getFullYear(),
                  likes: likeData.count || 0,
                  albumId: song.album.id,
                };
              } catch (err) {
                console.error(`Error al cargar canción ${songId}:`, err);
                return null;
              }
            })
          );

          setAlbums(fetchedAlbums.filter(Boolean));
        }
      } catch (err) {
        console.error("Error al cargar detalles de la lista:", err);
      }
    };

    fetchList();
  }, [id, spotifyToken]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const uid = localStorage.getItem("uid");

    try {
      const res = await fetch(`http://localhost:4000/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userUid: uid,
          targetId: list._id,
          type: "list",
          content: newComment,
          rating: null,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar comentario");

      setNewComment("");
      fetchComments(); // vuelve a cargar los comentarios
    } catch (err) {
      console.error("Error al añadir comentario:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/comments/${list._id}?type=list`);
      const data = await res.json();

      // Obtener todos los uids únicos de los comentarios
      const uniqueUids = [...new Set(data.map((c) => c.userUid))];

      // Obtener la información de todos los usuarios (en paralelo)
      const userInfoMap = {};
      await Promise.all(
        uniqueUids.map(async (uid) => {
          try {
            const resUser = await fetch(`http://localhost:4000/api/users/${uid}`);
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

      // Combinar los comentarios con info real de usuario
      setComments(
        data.map((c) => ({
          id: c._id,
          user: userInfoMap[c.userUid],
          text: c.content,
          timestamp: new Date(c.createdAt).toLocaleString(),
        }))
      );
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };


  useEffect(() => {
    if (list?._id) {
      fetchComments();
    }
  }, [list]);

  const handleUpdateList = async (updatedData) => {
    let imageUrl = updatedData.coverImageUrl;
    try {
      if (updatedData.coverImageFile instanceof File) {
        const uid = localStorage.getItem("uid");
        const fileRef = ref(storage, `playlist/${uid}/${updatedData._id}`);
        await uploadBytes(fileRef, updatedData.coverImageFile);
        imageUrl = await getDownloadURL(fileRef);
      }
      const res = await fetch(`http://localhost:4000/api/lists/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedData, coverImageUrl: imageUrl }),
      });
      if (!res.ok) throw new Error("Error al actualizar lista");
      const newList = await res.json();
      setList(newList);
      setShowEditModal(false);
      return newList;
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      throw err;
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=5`, {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });
      const data = await res.json();
      const results = data.tracks?.items?.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        cover: track.album.images?.[0]?.url || "",
      })) || [];
      setSearchResults(results);
    } catch (error) {
      console.error("Error en búsqueda Spotify:", error);
    }
  };

  if (list === null) {
    return (
      <div className="min-h-screen text-white bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/60">
            Esta lista es privada o no tienes permiso para verla.
          </p>
        </div>
      </div>
    );
  }


  return (

    <div className="min-h-screen text-white relative overflow-hidden">
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          backgroundImage: 'var(--background-dynamic)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '300% 300%',
          backgroundAttachment: 'fixed',
          animation: 'fondo-move 10s ease-in-out infinite, fondo-pulso 12s ease-in-out infinite'
        }}
      />
      <Navbar />

      <div className="pt-24 pb-8 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={list.coverImageUrl || albums[0]?.cover || "/fallback.jpg"}
              alt={list.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 pt-4">
            <div className="mb-2">
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: list.isPrivate
                    ? "hsl(var(--color-accent)/0.2)"
                    : "hsl(var(--color-primary)/0.2)",
                  color: list.isPrivate
                    ? "hsl(var(--color-accent))"
                    : "hsl(var(--color-primary))",
                }}
              >
                {list.isPrivate ? "Lista Privada" : "Lista Pública"}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{list.title}</h1>
            <p className="text-white/80 text-lg mb-6">{list.description}</p>

            <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
              <span>{albums.length} canciones</span>
              <span>•</span>
              <span>{list.createdAt?.split("T")[0]}</span>
              <span>•</span>
              <span>{(list.likes || 0).toLocaleString()} me gusta</span>
            </div>

            {/* Botones */}
            <div className="flex gap-4 flex-wrap mt-4">
              {!isOwner && (
                <button
                  onClick={handleLike}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: isLiked
                      ? "hsl(var(--color-primary))"
                      : "transparent",
                    borderColor: "hsl(var(--color-primary))",
                    border: "2px solid",
                    color: isLiked ? "white" : "hsl(var(--color-primary))",
                  }}
                >
                  <i className={isLiked ? "ri-heart-fill" : "ri-heart-line"}></i>{" "}
                  Me gusta
                </button>
              )}

              <button
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "hsl(var(--color-primary-dark)/0.3)",
                  border: "2px solid hsl(var(--color-primary)/0.3)",
                }}
              >
                <i className="ri-share-line"></i> Compartir
              </button>

              {isOwner && list.type !== "album" && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "hsl(var(--color-primary)/0.3)",
                      border: "2px solid hsl(var(--color-primary)/0.4)",
                      color: "white",
                    }}
                  >
                    <i className="ri-edit-2-line mr-1"></i> Editar
                  </button>

                  <button
                    onClick={toggleEditSongsMode}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "hsl(var(--color-primary)/0.3)",
                      border: "2px solid hsl(var(--color-primary)/0.4)",
                      color: "white",
                    }}
                  >
                    <i className="ri-music-add-line mr-1"></i>{" "}
                    {isEditingSongs ? "Terminar edición" : "Agregar/Quitar canciones"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sección principal */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
          {/* Canciones */}
          <div
            className="flex-1 rounded-2xl p-4"
            style={{
              backgroundColor: "hsl(var(--color-primary) / 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid hsl(var(--color-primary) / 0.15)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Álbumes en esta lista</h2>
              <span className="text-sm text-yellow-400">{albums.length} álbumes</span>
            </div>

            {/* Barra de búsqueda visible si está en modo edición */}
            {isEditingSongs && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar canciones en Spotify..."
                className="mb-4 w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40"
              />
            )}

            {/* Renderizar canciones actuales */}
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition"
              >
                <span className="text-white/50">{i + 1}</span>
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/album/${album.albumId}`}
                    className="font-medium text-white hover:underline truncate"
                  >
                    {album.title}
                  </Link>
                  <p className="text-sm text-white/60 truncate">{album.artist}</p>
                </div>
                <span className="text-sm text-white/50">{album.year}</span>

                {!isEditingSongs ? (
                  <div className="flex items-center gap-1 text-white/50">
                    <i className="ri-heart-line text-sm"></i>
                    <span>{album.likes}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmRemoveSong(album.id)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Quitar canción"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                )}
              </div>
            ))}

            {/* Resultados de búsqueda */}
            {isEditingSongs && searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-white/80">Resultados</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <img
                      src={result.cover}
                      alt={result.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{result.title}</h3>
                      <p className="text-sm text-white/60 truncate">{result.artist}</p>
                    </div>
                    <button
                      onClick={() => handleAddSong(result.id)}
                      className="text-green-400 hover:text-green-600"
                    >
                      <i className="ri-add-line text-xl"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comentarios */}
          <div
            className="lg:w-80 rounded-2xl p-4"
            style={{
              backgroundColor: "hsl(var(--color-primary) / 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid hsl(var(--color-primary) / 0.15)",
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Comentarios</h3>

            {!isOwner && (
              <>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm mb-2"
                  placeholder="Comparte tu opinión sobre esta lista..."
                />
                <button
                  onClick={handleAddComment}
                  className="w-full py-2 rounded-xl bg-yellow-500 text-black font-semibold hover:scale-105 transition-all mb-4"
                >
                  Comentar
                </button>
              </>
            )}

            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-white/50 text-sm italic">Sin comentarios aún.</p>
              )}

              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-sm">{comment.user.username}</span>
                    <span className="text-xs text-white/50">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-white/80">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditListModal
          onClose={() => setShowEditModal(false)}
          list={list}
          onSubmit={handleUpdateList}
        />
      )}

      {songToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-white mb-4">¿Quitar esta canción?</h2>
            <p className="text-white/70 mb-6">Esta acción eliminará la canción de la lista.</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleRemoveSong}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Quitar
              </button>
              <button
                onClick={() => setSongToRemove(null)}
                className="px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetail;
