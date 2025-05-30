// src/hooks/useAlbumDescription.js
import { useEffect, useState } from 'react';
import useLastFmAPI from './useLastFmAPI';

const useAlbumDescription = (artistName, albumName) => {
  const [description, setDescription] = useState(null);
  const callLastFm = useLastFmAPI();

  useEffect(() => {
    if (!artistName || !albumName) return;

    const fetchDescription = async () => {
      const res = await callLastFm('album.getInfo', {
        artist: artistName,
        album: albumName,
      });

      const summary = res?.album?.wiki?.summary || null;
      setDescription(summary);
    };

    fetchDescription();
  }, [artistName, albumName, callLastFm]);

  return description;
};

export default useAlbumDescription;
