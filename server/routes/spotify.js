const express = require('express');
const router = express.Router();
const connectDB = require('../db');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// POST /api/spotify/callback
router.post('/callback', async (req, res) => {
  const { code, uid } = req.body;

  if (!code || !uid) {
    return res.status(400).json({ error: 'Faltan parámetros (code o uid)' });
  }

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();
    console.log('Respuesta de Spotify:', data);

    if (data.error) {
      return res.status(400).json({ error: data.error_description || 'Error al obtener token de Spotify' });
    }

    const db = await connectDB();
    const users = db.collection('users');

    // Obtener display name del perfil del usuario
    const perfilRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });

    const perfil = await perfilRes.json();
    const displayName = perfil.display_name || perfil.id || 'Usuario Spotify';

    // Guardar en MongoDB
    await users.updateOne(
      { uid },
      {
        $set: {
          spotify: {
            connected: true,
            accessToken: data.access_token || null,
            refreshToken: data.refresh_token || null,
            displayName: displayName
          }
        }
      },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error Spotify:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/spotify/refresh
router.post('/refresh', async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID requerido' });
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');
    const user = await users.findOne({ uid });

    if (!user || !user.spotify?.refreshToken) {
      return res.status(404).json({ error: 'No se encontró refresh_token para este usuario.' });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', user.spotify.refreshToken);
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();
    console.log('Refresh token response:', data);

    if (data.error) {
      return res.status(400).json({ error: data.error_description || 'Error al refrescar token' });
    }

    await users.updateOne(
      { uid },
      { $set: { 'spotify.accessToken': data.access_token } }
    );

    res.status(200).json({ accessToken: data.access_token });
  } catch (err) {
    console.error('Error al refrescar token:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
