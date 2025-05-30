const express = require('express');
const router = express.Router();
const connectDB = require('../db');

router.post('/', async (req, res) => {
  const { userUid, title, imageUrl, createdAt } = req.body;

  if (!userUid || !title || !imageUrl || !createdAt) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const db = await connectDB();
    const charts = db.collection('charts');

    const chartData = {
      userUid,
      title,
      imageUrl,
      createdAt: new Date(createdAt),
    };

    const result = await charts.insertOne(chartData);

    res.status(201).json({ success: true, chartId: result.insertedId });
  } catch (err) {
    console.error('Error al guardar chart:', err);
    res.status(500).json({ error: 'Error al guardar el chart' });
  }
});

module.exports = router;
