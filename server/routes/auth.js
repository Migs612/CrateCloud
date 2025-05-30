const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// Registro de nuevo usuario
router.post('/register', async (req, res) => {
  const { uid, email, username } = req.body;

  if (!uid || !email || !username) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const usuario = {
      uid,
      username,
      email,
      bio: "",
      profileImageUrl: "",
      favoriteAlbums: [],
      favoriteSongId: "",
      following: [],
      followingArtists: [],
      followingUsers: [],
      followers: [],
      friends: [],
      blockedUsers: [],
      blockedBy: [],
      createdAt: new Date().toISOString()
    };

    await users.insertOne(usuario);
    res.status(201).json({ mensaje: 'Usuario registrado en MongoDB' });
  } catch (error) {
    console.error('Error al guardar en MongoDB:', error);
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});

// Verificar si un usuario existe por UID
router.get('/check/:uid', async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection('users');
    const user = await users.findOne({ uid: req.params.uid });

    if (user) {
      res.status(200).json({ existe: true });
    } else {
      res.status(404).json({ existe: false });
    }
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

// Verificar si un nombre de usuario ya existe
router.get('/username-exists/:username', async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection('users');
    const existe = await users.findOne({ username: req.params.username });

    if (existe) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error('Error al verificar username:', error);
    res.status(500).json({ error: 'Error al verificar nombre de usuario' });
  }
});

module.exports = router;