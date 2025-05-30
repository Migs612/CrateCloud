const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const connectDB = require('../db');

// Añadir like
router.post('/', async (req, res) => {
  const { uid, listId } = req.body;

  if (!uid || !listId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const db = await connectDB();
    const likes = db.collection('likes');

    const existing = await likes.findOne({ uid, listId });

    if (existing) {
      return res.status(409).json({ mensaje: 'Ya le diste like a esta lista' });
    }

    await likes.insertOne({
      uid,
      listId,
      createdAt: new Date()
    });

    res.status(201).json({ mensaje: 'Like añadido' });
  } catch (err) {
    console.error('Error al añadir like:', err);
    res.status(500).json({ error: 'Error al añadir like' });
  }
});

// Eliminar like
router.delete('/', async (req, res) => {
  const { uid, listId } = req.body;

  if (!uid || !listId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const db = await connectDB();
    const likes = db.collection('likes');

    await likes.deleteOne({ uid, listId });

    res.status(200).json({ mensaje: 'Like eliminado' });
  } catch (err) {
    console.error('Error al eliminar like:', err);
    res.status(500).json({ error: 'Error al eliminar like' });
  }
});

// Contar likes de una lista
router.get('/count/:listId', async (req, res) => {
  try {
    const db = await connectDB();
    const likes = db.collection('likes');
    const count = await likes.countDocuments({ listId: req.params.listId });
    res.status(200).json({ count });
  } catch (err) {
    console.error('Error al contar likes:', err);
    res.status(500).json({ error: 'Error al contar likes' });
  }
});

// Obtener feed de likes
router.get('/feed', async (req, res) => {
  try {
    const db = await connectDB();
    const likes = db.collection('likes');

    const result = await likes
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener feed:', err);
    res.status(500).json({ error: 'Error al obtener feed de likes' });
  }
});

// GET /api/likes/exists?uid=...&listId=...
router.get('/exists', async (req, res) => {
  const { uid, listId } = req.query;

  if (!uid || !listId) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const db = await connectDB();
    const likes = db.collection('likes');
    const exists = await likes.findOne({ uid, listId });

    res.status(200).json({ liked: Boolean(exists) });
  } catch (err) {
    console.error('Error al verificar like:', err);
    res.status(500).json({ error: 'Error al verificar like' });
  }
});

// Obtener los últimos likes de un usuario
router.get('/user/:uid/recent', async (req, res) => {
  const { uid } = req.params;

  try {
    const db = await connectDB();
    const likes = db.collection('likes');
    const lists = db.collection('lists');
    const users = db.collection('users');

    const recentLikes = await likes
      .find({ uid })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    const result = await Promise.all(
      recentLikes.map(async (like) => {
        const list = await lists.findOne({ _id: new ObjectId(like.listId) });
        if (!list) return null;

        const owner = await users.findOne({ uid: list.userUid });

        return {
          id: list._id,
          title: list.title,
          coverImage: list.coverImageUrl || "/fallback.jpg",
          creator: owner?.username || "Desconocido",
        };
      })
    );

    res.status(200).json(result.filter(Boolean));
  } catch (err) {
    console.error("Error al obtener likes recientes:", err);
    res.status(500).json({ error: "Error al obtener likes recientes" });
  }
});

module.exports = router;
