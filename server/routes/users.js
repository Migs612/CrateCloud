const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// Obtener usuario por UID
router.get('/:uid', async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ uid: req.params.uid });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar imagen y/o álbumes favoritos
router.put('/:uid', async (req, res) => {
  const { profileImageUrl, favoriteAlbums } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const updateFields = {};
    if (profileImageUrl) updateFields.profileImageUrl = profileImageUrl;
    if (favoriteAlbums) updateFields.favoriteAlbums = favoriteAlbums;

    await users.updateOne(
      { uid: req.params.uid },
      { $set: updateFields }
    );

    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

module.exports = router;
