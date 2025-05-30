import React, { useEffect, useRef, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import useSpotifyAppToken from '../../hooks/useSpotifyAppToken';
import { auth } from '../../hooks/firebase';

const PersonalizarAlbumes = ({ onClose }) => {
    const [favoritos, setFavoritos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [albumParaEliminar, setAlbumParaEliminar] = useState(null);
    const token = useSpotifyAppToken();
    const timeoutRef = useRef(null);

    const uid = auth.currentUser?.uid;

    useEffect(() => {
        const fetchFavoritosGuardados = async () => {
            if (!uid || !token) return;
            try {
                const res = await fetch(`http://localhost:4000/api/users/${uid}`);
                const data = await res.json();
                const ids = data.favoriteAlbums || [];

                const detalles = await Promise.all(
                    ids.map(async (id) => {
                        const r = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        return await r.json();
                    })
                );

                setFavoritos(detalles);
            } catch (err) {
                console.error('Error al cargar favoritos:', err);
            }
        };

        fetchFavoritosGuardados();
    }, [uid, token]);

    useEffect(() => {
        if (!token || !busqueda.trim()) {
            setResultados([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(busqueda)}&type=album&limit=10`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                if (data.albums?.items) {
                    setResultados(data.albums.items);
                }
            } catch (err) {
                console.error('Error al buscar álbumes:', err);
            }
        }, 400);
    }, [busqueda, token]);

    const añadirAlbum = (album) => {
        if (favoritos.find(a => a.id === album.id)) return;
        if (favoritos.length >= 6) return;
        setFavoritos(prev => [...prev, album]);
    };

    const eliminarAlbum = (id) => {
        setFavoritos(prev => prev.filter(a => a.id !== id));
        setAlbumParaEliminar(null);
    };

    const guardarCambios = async () => {
        if (!uid) return;
        const ids = favoritos.map(a => a.id);

        try {
            await fetch(`http://localhost:4000/api/users/${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favoriteAlbums: ids }),
            });
            onClose();
        } catch (err) {
            console.error('Error al guardar en MongoDB:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-[#1a0033] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20">

                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-400">
                    <FiX size={24} />
                </button>

                <h2 className="text-2xl text-white font-bold mb-4 text-center">Personalizar Álbumes</h2>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
                    {[...Array(6)].map((_, i) => {
                        const album = favoritos[i];
                        return album ? (
                            <div
                                key={album.id}
                                className="relative w-full aspect-square rounded-lg overflow-hidden bg-white/10 shadow cursor-pointer"
                                onClick={() => setAlbumParaEliminar(album)}
                            >
                                <img src={album.images[0]?.url} alt={album.name} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div
                                key={`vacio-${i}`}
                                className="w-full aspect-square bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20"
                            >
                                <FiPlus size={28} className="text-white opacity-60" />
                            </div>
                        );
                    })}
                </div>

                <input
                    type="text"
                    placeholder="Buscar álbum por título..."
                    className="w-full p-2 rounded bg-purple-800 text-white placeholder-purple-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="overflow-y-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-purple-700">
                    {busqueda.trim() && resultados.map((album) => (
                        <div key={album.id} className="flex items-center gap-4 mb-3 bg-white/5 p-2 rounded hover:bg-white/10">
                            <div className="w-16 h-16 bg-white/20 rounded shadow-md overflow-hidden">
                                <img src={album.images[0]?.url} alt={album.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-white">
                                <div className="font-semibold">{album.name}</div>
                                <div className="text-sm text-purple-300">{album.artists[0]?.name}</div>
                            </div>
                            <button
                                onClick={() => añadirAlbum(album)}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white font-semibold"
                            >
                                Añadir
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={guardarCambios}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold shadow"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>

            {albumParaEliminar && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#2a0044] p-6 rounded-lg shadow-xl border border-white/20 max-w-xs text-center transform scale-95 opacity-0 animate-fade-in">
                        <p className="text-white font-semibold mb-4">
                            ¿Seguro que quieres eliminar este álbum?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => eliminarAlbum(albumParaEliminar.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setAlbumParaEliminar(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
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

export default PersonalizarAlbumes;