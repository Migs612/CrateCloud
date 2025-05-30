const express = require('express');
const { ObjectId } = require('mongodb');
const connectDB = require('../db'); // Ajusta el path si tu conexión está en otro sitio

const router = express.Router();

// Obtener la cantidad de likes reales de una canción
// (cuántas listas de tipo "liked-songs" la contienen)
router.get('/:id/likes', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de canción no proporcionado" });
  }

  try {
    const db = await connectDB();
    const lists = db.collection('lists');

    const count = await lists.countDocuments({
      type: 'liked-songs',
      songIds: id,
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error('Error al obtener likes de canción:', err);
    res.status(500).json({ error: 'Error al contar likes de la canción' });
  }
});

module.exports = router;
