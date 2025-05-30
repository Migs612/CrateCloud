import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CreateListModal from "../components/Global/CreateListModal";
import UserListCard from "../components/Lists/UserListCard";

import ListsSidebar from "../components/Lists/ListsSidebar";
import ListsHeader from "../components/Lists/ListsHeader";
import Navbar from "../components/Global/Navbar";

const Lists = () => {
  const [userLists, setUserLists] = useState([]);
  const [recentlyLiked, setRecentlyLiked] = useState([]);
  const [likedLists, setLikedLists] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [albumListCount, setAlbumListCount] = useState(0);
  const [newList, setNewList] = useState({
    title: "",
    description: "",
    isPrivate: false,
  });

  const fetchRecentlyLiked = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const res = await fetch(`http://localhost:4000/api/likes/user/${uid}/recent`);
      const data = await res.json();
      setRecentlyLiked(data);
    } catch (err) {
      console.error("Error al obtener likes recientes:", err);
    }
  };

  const ensureDefaultListsExist = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const res = await fetch(`http://localhost:4000/api/lists/ensure-defaults/${uid}`, {
        method: "POST",
      });

      if (!res.ok) {
        console.error("Fallo al crear/verificar listas predeterminadas");
      }
    } catch (err) {
      console.error("Error al asegurar listas por defecto:", err);
    }
  };

  const fetchUserLists = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const res = await fetch(`http://localhost:4000/api/lists/user/${uid}`);
      const data = await res.json();
      setUserLists(data);

      const albums = data.filter((l) => l.type === "album");
      setAlbumListCount(albums.length);
    } catch (error) {
      console.error("Error cargando listas del usuario:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await ensureDefaultListsExist();
      await fetchUserLists();
      await fetchRecentlyLiked();
    };

    initialize();
  }, []);


  const handleLike = (listId) => {
    setLikedLists((prev) => {
      const newLikedLists = new Set(prev);
      if (newLikedLists.has(listId)) {
        newLikedLists.delete(listId);
      } else {
        newLikedLists.add(listId);
      }
      return newLikedLists;
    });
  };

  const handleCreateList = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userUid: localStorage.getItem("uid"),
          title: newList.title,
          description: newList.description,
          isPrivate: newList.isPrivate,
          coverImageUrl: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserLists([data, ...userLists]);
        setShowCreateModal(false);
        setNewList({ title: "", description: "", isPrivate: false });
      } else {
        console.error("Error creando lista:", data.error);
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: "#121212" }}
    >
      <Navbar />
      <CreateListModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateList}
        newList={newList}
        setNewList={setNewList}
      />

      <ListsHeader
        userLists={userLists}
        setShowCreateModal={setShowCreateModal}
        albumListCount={albumListCount}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Mis listas</h2>
                <Link
                  to="/lists/my"
                  className="text-sm flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                  style={{ color: "hsl(var(--color-primary-light))" }}
                >
                  <span>Ver todas</span>
                  <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>

              {userLists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userLists.map((list) => (
                    <UserListCard key={list._id} list={list} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No tienes listas aún
                  </h3>
                  <p className="text-white/60 mb-4">
                    Crea tu primera lista para comenzar
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-lg text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                    }}
                  >
                    Crear mi primera lista
                  </button>
                </div>
              )}
            </div>
          </div>

          <ListsSidebar
            recentlyLiked={recentlyLiked}
            userLists={userLists}
            likedLists={likedLists}
            albumListCount={albumListCount}
            setShowCreateModal={setShowCreateModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Lists;
