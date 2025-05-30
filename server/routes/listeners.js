const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// Obtener los últimos 6 usuarios que han seguido a un artista
router.get('/artists/:id/listeners', async (req, res) => {
  const artistId = req.params.id;

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const result = await users
      .find({ "followingArtists.id": artistId })
      .project({
        uid: 1,
        username: 1,
        profileImageUrl: 1,
        favoriteSongId: 1,
        followingArtists: 1
      })
      .toArray();

    // Filtrar y mapear los que tienen el artista con followedAt
    const filtered = result
      .map(user => {
        const match = user.followingArtists?.find(a => a.id === artistId);
        return match ? {
          uid: user.uid,
          username: user.username,
          avatarUrl: user.profileImageUrl,
          favoriteSong: user.favoriteSongId || '',
          followedAt: match.followedAt
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.followedAt) - new Date(a.followedAt))
      .slice(0, 6);

    res.status(200).json(filtered);
  } catch (err) {
    console.error('Error al obtener oyentes:', err);
    res.status(500).json({ error: 'Error al obtener oyentes' });
  }
});

module.exports = router;
