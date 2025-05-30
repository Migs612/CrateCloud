const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

router.get('/token', async (req, res) => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta inválida de Spotify:', response.status, errorText);
      return res.status(500).json({ error: 'Spotify token request failed', details: errorText });
    }

    const data = await response.json();
    res.json({ access_token: data.access_token });
  } catch (err) {
    console.error('Error al obtener token de Spotify:', err);
    res.status(500).json({ error: 'No se pudo obtener el token' });
  }
});

module.exports = router;
