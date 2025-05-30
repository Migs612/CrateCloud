import React from 'react';
import { auth } from '../../hooks/firebase';
import { FiLink } from 'react-icons/fi';

const BotonesConexiones = ({ spotify, lastfm }) => {
  const handleConnectSpotify = () => {
    const clientId = 'dd5d5df43357426ab2e6e9cc019a71cb';
    const redirectUri = 'http://localhost:3000/spotify-callback';
    const scopes = [
      'user-top-read',
      'user-read-recently-played',
      'user-read-email',
      'user-read-private'
    ];
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${auth.currentUser.uid}`;
  };

  const handleConnectLastfm = () => {
    const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
    const callback = 'http://localhost:3000/lastfm-callback';
    window.location.href = `https://www.last.fm/api/auth/?api_key=${apiKey}&cb=${encodeURIComponent(callback)}`;
  };

  return (
    <div className="flex items-center gap-4 mt-2">
      <button
        onClick={handleConnectSpotify}
        className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
      >
        <FiLink className="text-white" />
        {spotify?.displayName || 'Conectar Spotify'}
      </button>

      <button
        onClick={handleConnectLastfm}
        className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
      >
        <FiLink className="text-white" />
        {lastfm?.username || 'Conectar Last.fm'}
      </button>
    </div>
  );
};

export default BotonesConexiones;
