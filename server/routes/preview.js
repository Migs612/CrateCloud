const express = require('express');
const router = express.Router();

// Solución ESM
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith('https://')) {
    return res.status(400).send('URL inválida');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener preview:', response.status, response.statusText);
      return res.status(response.status).send('Error al obtener preview');
    }

    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (err) {
    console.error('Error en proxy del preview:', err.message);
    res.status(500).send('Error en proxy del preview');
  }
});

module.exports = router;
