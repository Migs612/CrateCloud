// src/hooks/useLastFmAPI.js
import { useCallback } from 'react';
import md5 from 'crypto-js/md5';

const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const SHARED_SECRET = process.env.REACT_APP_LASTFM_SHARED_SECRET;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Hook que te devuelve una función lista para hacer peticiones a Last.fm
const useLastFmAPI = () => {
  const callLastFm = useCallback(async (method, params = {}, authToken = null) => {
    const defaultParams = {
      method,
      api_key: API_KEY,
      format: 'json',
      ...params,
    };

    // Si la petición requiere firma
    if (authToken) {
      defaultParams.token = authToken;
      const signature = generateApiSig({ ...defaultParams });
      defaultParams.api_sig = signature;
    }

    const queryString = new URLSearchParams(defaultParams).toString();
    const response = await fetch(`${BASE_URL}?${queryString}`);
    const data = await response.json();
    return data;
  }, []);

  return callLastFm;
};

// Genera una firma MD5 si necesitas autenticar (solo para métodos protegidos)
const generateApiSig = (params) => {
  const sortedKeys = Object.keys(params).sort();
  let signature = '';
  for (let key of sortedKeys) {
    signature += key + params[key];
  }
  signature += SHARED_SECRET;

  return md5(signature).toString();
};

export default useLastFmAPI;
