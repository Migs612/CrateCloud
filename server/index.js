// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const spotifyRoutes = require('./routes/spotify');
const lastfmRoutes = require('./routes/lastfm');
const spotifyTokenRoutes = require('./routes/spotifyToken');
const commentsRoutes = require('./routes/comments');
const followRoutes = require('./routes/follow');
const listenersRoutes = require('./routes/listeners');
const previewRoute = require('./routes/preview');
const chartsRoutes = require('./routes/charts');
const listsRoutes = require('./routes/lists');
const songsRoutes = require('./routes/songs');
const likesRoutes = require('./routes/likes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/lastfm', lastfmRoutes);
app.use('/api/spotify', spotifyTokenRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', followRoutes);
app.use('/api', listenersRoutes);
app.use('/api/proxy-preview', previewRoute);
app.use('/api/charts', chartsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/likes', likesRoutes);

// Iniciar servidor solo después de conectar a Mongo
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

startServer();
