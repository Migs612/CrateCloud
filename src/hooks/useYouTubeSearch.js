// src/hooks/useYouTubeSearch.js
import { useState } from 'react';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const useYouTubeSearch = () => {
  const [loading, setLoading] = useState(false);

  const searchYouTube = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${API_KEY}`
      );
      const data = await res.json();
      const videoId = data.items?.[0]?.id?.videoId || null;
      return videoId;
    } catch (err) {
      console.error('Error al buscar en YouTube:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchYouTube, loading };
};

export default useYouTubeSearch;
