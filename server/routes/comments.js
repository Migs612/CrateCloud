const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const connectDB = require('../db');

// Obtener comentarios por targetId y tipo (album, artist, etc.)
router.get('/:targetId', async (req, res) => {
  const { targetId } = req.params;
  const { type } = req.query;

  try {
    const db = await connectDB();

    const result = await db.collection('comments').aggregate([
      {
        $match: { targetId, type }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $lookup: {
          from: 'users', // nombre de tu colección de usuarios
          localField: 'userUid',
          foreignField: 'uid', // el campo que se relaciona con userUid
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true // en caso de que no se encuentre el usuario
        }
      },
      {
        $project: {
          content: 1,
          rating: 1,
          createdAt: 1,
          _id: 1,
          userUid: 1,
          username: '$user.username',
          avatar: '$user.profileImageUrl'
        }
      }
    ]).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Crear nuevo comentario
router.post('/', async (req, res) => {
  const { userUid, targetId, type, content, rating } = req.body;

  if (!userUid || !targetId || !type || !content) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const comment = {
    userUid,
    targetId,
    type,
    content,
    rating: rating || null,
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await connectDB();
    const comments = db.collection('comments');

    await comments.insertOne(comment);
    res.status(201).json({ mensaje: 'Comentario guardado' });
  } catch (err) {
    console.error('Error al guardar comentario:', err);
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});

module.exports = router;
