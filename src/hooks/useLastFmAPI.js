import { useCallback } from 'react';
import md5 from 'crypto-js/md5';

const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const SHARED_SECRET = process.env.REACT_APP_LASTFM_SHARED_SECRET;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const useLastFmAPI = () => {
  const callLastFm = useCallback(async (method, params = {}, authToken = null) => {
    if (!params.user) {
      console.error('Error: El nombre de usuario de Last.fm no está definido.');
      return;
    }

    const defaultParams = {
      method,
      api_key: API_KEY,
      format: 'json',
      ...params,
    };

    if (authToken) {
      defaultParams.token = authToken;
      const signature = generateApiSig({ ...defaultParams });
      defaultParams.api_sig = signature;
    }

    const queryString = new URLSearchParams(defaultParams).toString();
    const url = `${BASE_URL}?${queryString}`;

    console.log('URL de la solicitud:', url);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error(`Error al obtener datos de Last.fm: ${data.message}`);
        return;
      }

      return data;
    } catch (error) {
      console.error('Error al hacer la solicitud a Last.fm:', error);
    }
  }, []);

  return callLastFm;
};

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
