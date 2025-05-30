// src/hooks/useTranslatedText.js
import { useEffect, useState } from 'react';

const endpoints = [
  'https://translate.argosopentech.com/translate',
  'https://libretranslate.de/translate',
  'https://libretranslate.com/translate',
];

const useTranslatedText = (text, sourceLang = 'en', targetLang = 'es') => {
  const [translated, setTranslated] = useState(null);

  useEffect(() => {
    if (!text) return;

    const tryTranslate = async () => {
      for (let endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: text,
              source: sourceLang,
              target: targetLang,
              format: 'text',
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.translatedText) {
              setTranslated(data.translatedText);
              return;
            }
          } else {
            console.warn(`Fallo en ${endpoint} (${res.status}): ${res.statusText}`);
          }
        } catch (err) {
          console.warn(`Fallo de red en ${endpoint}, probando siguiente...`, err.message);
        }
      }

      console.warn('No se pudo traducir el texto con ningún servidor LibreTranslate.');
      setTranslated(null);
    };

    tryTranslate();
  }, [text, sourceLang, targetLang]);

  return translated;
};

export default useTranslatedText;
