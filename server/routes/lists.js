const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const connectDB = require('../db');

// Crear una nueva lista
router.post('/', async (req, res) => {
  const {
    userUid,
    title,
    coverImageUrl = '',
    isPrivate = false,
    isDefault = false,
    type = 'custom',
    songIds = [],
    description = ''
  } = req.body;

  if (!userUid || !title) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newList = {
    userUid,
    title,
    description,
    coverImageUrl,
    songIds,
    isPrivate,
    isDefault,
    type,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await connectDB();
    const lists = db.collection('lists');
    const result = await lists.insertOne(newList);
    res.status(201).json({ ...newList, _id: result.insertedId });
  } catch (err) {
    console.error('Error al crear lista:', err);
    res.status(500).json({ error: 'Error al crear lista' });
  }
});

// Obtener todas las listas de un usuario
router.get('/user/:userUid', async (req, res) => {
  const { userUid } = req.params;

  try {
    const db = await connectDB();
    const lists = db.collection('lists');
    const result = await lists.find({ userUid }).sort({ createdAt: -1 }).toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener listas:', err);
    res.status(500).json({ error: 'Error al obtener listas' });
  }
});

// Agregar una canción a una lista
router.put('/:id/add-song', async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  if (!songId) return res.status(400).json({ error: 'songId es requerido' });

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    await lists.updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { songIds: songId },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({ mensaje: 'Canción agregada correctamente' });
  } catch (err) {
    console.error('Error al agregar canción:', err);
    res.status(500).json({ error: 'Error al agregar canción' });
  }
});

// Asegura que el usuario tenga listas predeterminadas
router.post('/ensure-defaults/:userUid', async (req, res) => {
  const { userUid } = req.params;

  if (!userUid) return res.status(400).json({ error: 'userUid es requerido' });

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    const defaults = [
      {
        type: 'listen-later',
        title: 'Escuchar luego',
        description: 'Canciones para escuchar más tarde',
      },
      {
        type: 'liked-songs',
        title: 'Canciones que me gustan',
        description: 'Tus canciones favoritas',
      },
    ];

    const results = [];

    for (const def of defaults) {
      const result = await lists.updateOne(
        { userUid, type: def.type, isDefault: true },
        {
          $setOnInsert: {
            userUid,
            title: def.title,
            description: def.description,
            coverImageUrl: '',
            isPrivate: true,
            isDefault: true,
            type: def.type,
            songIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        },
        { upsert: true }
      );

      const list = await lists.findOne({
        userUid,
        type: def.type,
        isDefault: true
      });

      results.push(list);
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error asegurando listas por defecto:', err);
    res.status(500).json({ error: 'Error al asegurar listas predeterminadas' });
  }
});

// Eliminar una canción de una lista
router.put('/:id/remove-song', async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  if (!songId) return res.status(400).json({ error: 'songId es requerido' });

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    await lists.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { songIds: songId },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({ mensaje: 'Canción eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar canción:', err);
    res.status(500).json({ error: 'Error al eliminar canción' });
  }
});

// Obtener una lista por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de lista inválido' });
  }

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    const list = await lists.findOne({ _id: new ObjectId(id) });

    if (!list) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }

    res.status(200).json(list);
  } catch (err) {
    console.error('Error al obtener la lista por ID:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/songs/:id/likes
router.get("/songs/:id/likes", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const lists = db.collection("lists");

    const count = await lists.countDocuments({
      type: "liked-songs",
      songIds: id,
    });

    res.json({ count });
  } catch (err) {
    console.error("Error al contar likes:", err);
    res.status(500).json({ error: "Error al contar likes" });
  }
});

// Actualizar una lista existente
router.put('/:id', async (req, res) => {
  let { id } = req.params;
  const { title, description, coverImageUrl, isPrivate } = req.body;

  id = id.trim();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    // Paso 1: actualizar
    const updateRes = await lists.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          coverImageUrl,
          isPrivate,
          updatedAt: new Date(),
        },
      }
    );

    if (updateRes.matchedCount === 0) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }

    // Paso 2: recuperar la lista actualizada
    const updatedList = await lists.findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedList);
  } catch (err) {
    console.error('Error al actualizar la lista:', err);
    res.status(500).json({ error: 'Error al actualizar la lista' });
  }
});

module.exports = router;