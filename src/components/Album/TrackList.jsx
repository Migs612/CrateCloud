import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import useYouTubeSearch from '../../hooks/useYouTubeSearch';
import toast from 'react-hot-toast';

const TrackList = ({ tracks }) => {
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [noPreviewMessage, setNoPreviewMessage] = useState(false);
  const menuRef = useRef(null);
  const playerRef = useRef(null);

  const { searchYouTube } = useYouTubeSearch();

  const handlePlayTrack = async (track) => {
    const searchQuery = `${track.name} ${track.artists?.map(a => a.name).join(' ')}`;

    if (currentTrackId === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    const videoId = await searchYouTube(searchQuery);
    if (videoId) {
      setCurrentTrackId(track.id);
      setCurrentVideoId(videoId);
      setIsPlaying(true);
    } else {
      setNoPreviewMessage(true);
      setTimeout(() => setNoPreviewMessage(false), 3000);
    }
  };

  const handleLikeTrack = async (trackId, e) => {
    e.stopPropagation();
    const uid = localStorage.getItem("uid");

    try {
      const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
      const lists = await res.json();
      const likedList = lists.find((l) => l.type === "liked-songs");

      if (!likedList) return;

      const isLiked = likedList.songIds.includes(trackId);

      if (isLiked) {
        await fetch(`http://localhost:4000/api/lists/${likedList._id}/remove-song`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songId: trackId }),
        });

        toast.success("Quitado de 'Me gusta'");
        setLikedTracks((prev) => ({ ...prev, [trackId]: false }));
      } else {
        await fetch(`http://localhost:4000/api/lists/${likedList._id}/add-song`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songId: trackId }),
        });

        toast.success("Agregado a 'Me gusta'");
        setLikedTracks((prev) => ({ ...prev, [trackId]: true }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar 'Me gusta'");
    }
  };

  const handleListenLater = async (trackId) => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
      const lists = await res.json();
      const listenLater = lists.find((l) => l.type === "listen-later");

      if (!listenLater) {
        toast.error("No se encontró la lista 'Escuchar luego'");
        return;
      }

      const songIds = listenLater.songIds.map(String); // forzamos a string
      const isAlready = songIds.includes(String(trackId));

      if (isAlready) {
        toast("Ya está en 'Escuchar luego'", { icon: "🔁" });
        return;
      }

      const addRes = await fetch(`http://localhost:4000/api/lists/${listenLater._id}/add-song`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: trackId }),
      });

      if (addRes.ok) {
        toast.success("Agregado a 'Escuchar luego'");
      } else {
        toast.error("Error al añadir canción");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado");
    }
  };

  const handleMoreClick = (trackId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === trackId ? null : trackId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo cerrar si el click NO fue en un botón dentro del menú
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-option")
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid || !tracks.length) return;

    const fetchLikedSongs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
        const lists = await res.json();
        const likedList = lists.find((l) => l.type === "liked-songs");
        if (!likedList) return;

        const likedMap = {};
        for (const track of tracks) {
          likedMap[track.id] = likedList.songIds.includes(track.id);
        }
        setLikedTracks(likedMap);
      } catch (err) {
        console.error("Error al cargar canciones que te gustan:", err);
      }
    };

    fetchLikedSongs();
  }, [tracks]);


  const formatDuration = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full relative">
      {noPreviewMessage && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-sm px-4 py-2 rounded shadow-lg z-20 animate-fade-in">
          🎵 No se encontró preview para esta canción.
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Canciones</h2>
        <div className="text-sm text-white/60">
          {tracks.length} canciones, {Math.ceil(tracks.reduce((acc, t) => acc + t.duration_ms, 0) / 60000)} min
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-1">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            className={`group flex items-center py-2.5 px-4 rounded-md transition-all ${currentTrackId === track.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
          >
            <div className="w-8 text-center flex justify-center">
              <button onClick={() => handlePlayTrack(track)} className="w-6 h-6 text-white/60 group-hover:text-white">
                {currentTrackId === track.id && isPlaying ? (
                  <i className="ri-pause-mini-fill text-xl"></i>
                ) : (
                  <>
                    <span className="group-hover:hidden">{i + 1}</span>
                    <i className="ri-play-fill text-lg hidden group-hover:block"></i>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 ml-3">
              <div className="font-medium text-white/90">{track.name}</div>
              <div className="text-sm text-white/60">{track.artists?.map((a) => a.name).join(', ')}</div>
            </div>

            <div className="flex items-center">
              <button onClick={(e) => handleLikeTrack(track.id, e)} className="w-8 h-8">
                <i className={`${likedTracks[track.id] ? 'ri-heart-fill text-pink-500' : 'ri-heart-line text-white/40'}`}></i>
              </button>
              <div className="w-12 text-right text-sm text-white/60">{formatDuration(track.duration_ms)}</div>
              <div className="relative" ref={menuRef}>
                <button onClick={(e) => handleMoreClick(track.id, e)} className="w-8 h-8 ml-2 text-white/40 hover:text-white">
                  <i className="ri-more-fill"></i>
                </button>
                {activeMenu === track.id && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-800/95 backdrop-blur-md border border-white/10 rounded-md shadow-xl py-1 z-10 w-48 animate-fade-in">
                    <button onClick={() => handleListenLater(track.id)} className="dropdown-option w-full text-left px-3 py-2 hover:bg-white/10 text-white/80 text-sm flex items-center">
                      <i className="ri-time-line mr-2"></i>
                      Escuchar luego
                    </button>
                    <button className="dropdown-option w-full text-left px-3 py-2 hover:bg-white/10 text-white/80 text-sm flex items-center">
                      <i className="ri-play-list-add-line mr-2"></i>
                      Añadir a playlist
                    </button>
                    <button className="dropdown-option w-full text-left px-3 py-2 hover:bg-white/10 text-white/80 text-sm flex items-center">
                      <i className="ri-share-line mr-2"></i>
                      Compartir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentVideoId && (
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${currentVideoId}`}
          playing={isPlaying}
          controls={false}
          width="0"
          height="0"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default TrackList;
