/* global use, db */
// MongoDB Playground – CrateCloud
// Este script crea las colecciones base y documentos de ejemplo para CrateCloud.
// Asegúrate de estar conectado a tu cluster MongoDB Atlas antes de ejecutar.

// Seleccionar la base de datos
use('CrateCloud');

// Insertar documento en la colección users
db.getCollection('users').insertOne({
  uid: "firebase-uid-123",
  username: "PedroLoFi",
  email: "pedro@example.com",
  displayName: "Pedro",
  bio: "Amante del Lo-Fi",
  profileImageUrl: "https://firebase.storage/user123/profile.jpg",
  favoriteAlbums: ["spotify:album:1", "spotify:album:2"],
  favoriteSongId: "spotify:track:abc123",
  following: ["firebase-uid-456"],
  followers: ["firebase-uid-789"],
  blockedUsers: ["firebase-uid-999"],
  blockedBy: [],
  createdAt: new Date("2025-05-11T12:00:00Z")
});

// Insertar documento en la colección charts
db.getCollection('charts').insertOne({
  userUid: "firebase-uid-123",
  title: "Top Jazz 2025",
  imageUrl: "https://firebase.storage/user123/chart1.jpg",
  createdAt: new Date("2025-05-11T12:00:00Z")
});

// Insertar documento en la colección reviews
db.getCollection('reviews').insertOne({
  userUid: "firebase-uid-123",
  spotifyId: "spotify:album:XYZ123",
  type: "album",
  content: "Un viaje sonoro.",
  rating: 4.8,
  createdAt: new Date("2025-05-11T12:00:00Z")
});

// Insertar documento en la colección playlists
db.getCollection('playlists').insertOne({
  _id: "playlistId123",
  userUid: "firebase-uid-123",
  title: "Lo-Fi para estudiar",
  description: "Mi selección personal de Lo-Fi suave.",
  coverImageUrl: "https://firebase.storage/user123/playlist123.jpg",
  songIds: [
    "spotify:track:abc123",
    "spotify:track:def456",
    "spotify:track:ghi789"
  ],
  createdAt: new Date("2025-05-11T12:00:00Z"),
  updatedAt: new Date("2025-05-11T12:30:00Z")
});
