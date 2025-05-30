const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const connectDB = require('../db');

const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const SHARED_SECRET = process.env.REACT_APP_LASTFM_SHARED_SECRET;

// POST /api/lastfm/session
router.post('/session', async (req, res) => {
  const { token, uid } = req.body;
  if (!token || !uid) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  // Construir firma (api_sig)
  const params = {
    method: 'auth.getSession',
    api_key: API_KEY,
    token,
  };

  const sigBase = Object.keys(params)
    .sort()
    .map(key => `${key}${params[key]}`)
    .join('') + SHARED_SECRET;

  const api_sig = crypto.createHash('md5').update(sigBase).digest('hex');

  const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${API_KEY}&token=${token}&api_sig=${api_sig}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.message });
    }

    const db = await connectDB();
    const users = db.collection('users');

    await users.updateOne(
      { uid },
      {
        $set: {
          lastfm: {
            connected: true,
            username: data.session.name,
            sessionKey: data.session.key
          }
        }
      },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error al conectar con Last.fm:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
