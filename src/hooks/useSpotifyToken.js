// src/hooks/useSpotifyToken.js
import { useEffect, useState } from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const useSpotifyToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      setToken(data.access_token);
    };

    fetchToken();
  }, []);

  return token;
};

export default useSpotifyToken;
