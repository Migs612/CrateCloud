const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// SEGUIR a un artista o usuario
router.post('/follow', async (req, res) => {
  const { uid, targetId, targetType } = req.body;
  if (!uid || !targetId || !['artist', 'user'].includes(targetType)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (targetType === 'artist') {
      const alreadyFollowing = user.followingArtists?.some(a => a.id === targetId);
      if (!alreadyFollowing) {
        await users.updateOne(
          { uid },
          {
            $push: {
              followingArtists: {
                id: targetId,
                followedAt: new Date().toISOString()
              }
            }
          }
        );
      }
    }

    if (targetType === 'user') {
      if (!user.followingUsers?.includes(targetId)) {
        await users.updateOne(
          { uid },
          { $addToSet: { followingUsers: targetId } }
        );
      }

      await users.updateOne(
        { uid: targetId },
        { $addToSet: { followers: uid } }
      );

      const targetUser = await users.findOne({ uid: targetId });
      if (targetUser?.followingUsers?.includes(uid)) {
        await users.updateOne(
          { uid },
          { $addToSet: { friends: targetId } }
        );
        await users.updateOne(
          { uid: targetId },
          { $addToSet: { friends: uid } }
        );
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error en follow:', err);
    res.status(500).json({ error: 'Error al seguir' });
  }
});

// DEJAR DE SEGUIR
router.post('/unfollow', async (req, res) => {
  const { uid, targetId, targetType } = req.body;
  if (!uid || !targetId || !['artist', 'user'].includes(targetType)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');

    if (targetType === 'artist') {
      await users.updateOne(
        { uid },
        { $pull: { followingArtists: { id: targetId } } }
      );
    }

    if (targetType === 'user') {
      await users.updateOne(
        { uid },
        { $pull: { followingUsers: targetId, friends: targetId } }
      );
      await users.updateOne(
        { uid: targetId },
        { $pull: { followers: uid, friends: uid } }
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error en unfollow:', err);
    res.status(500).json({ error: 'Error al dejar de seguir' });
  }
});

// VERIFICAR si sigue a otro usuario o artista
router.post('/check-following', async (req, res) => {
  const { uid, targetId, targetType } = req.body;
  if (!uid || !targetId || !['artist', 'user'].includes(targetType)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    let following = false;

    if (targetType === 'artist') {
      following = user.followingArtists?.some(a => a.id === targetId);
    } else if (targetType === 'user') {
      following = user.followingUsers?.includes(targetId);
    }

    res.status(200).json({ following: !!following });
  } catch (err) {
    console.error('Error comprobando seguimiento:', err);
    res.status(500).json({ error: 'Error al verificar seguimiento' });
  }
});

module.exports = router;
