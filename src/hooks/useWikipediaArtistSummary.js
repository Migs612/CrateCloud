// src/hooks/useWikipediaArtistSummary.js
import { useEffect, useState } from 'react';

const useWikipediaArtistSummary = (name) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const capitalizeFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const capitalizeAllWords = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const capitalizeCommon = (str) => {
    const lowercaseWords = ['a', 'an', 'the', 'of', 'in', 'on', 'and', 'or', 'for', 'to', 'with'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        lowercaseWords.includes(word) && index !== 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
  };

  useEffect(() => {
    if (!name) return;

    const fetchSummary = async (lang, query) => {
      try {
        const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (!res.ok) return null;

        const data = await res.json();

        if (data?.type === 'disambiguation') {
          const extract = data?.extract?.toLowerCase();
          const lowerName = name.toLowerCase();
          const contieneArtista = extract?.includes('cantante') || extract?.includes('músico') || extract?.includes(lowerName);
          if (!contieneArtista) return null;
        }

        return data;
      } catch (err) {
        console.warn(`Error en Wikipedia para: ${query}`, err);
        return null;
      }
    };

    const getSummary = async () => {
      setLoading(true);

      const lower = name.toLowerCase();
      const first = capitalizeFirst(lower);
      const allWords = capitalizeAllWords(lower);
      const commonFormat = capitalizeCommon(lower);

      const baseVariants = [
        lower,
        first,
        allWords,
        commonFormat,
      ];

      const suffixes = ['', ' (cantante)', ' (banda)', ' (músico)', ' (rapero)', ' (grupo musical)'];

      const allVariants = baseVariants.flatMap((base) =>
        suffixes.map((suffix) => `${base}${suffix}`)
      );

      for (const variant of allVariants) {
        const data = await fetchSummary('es', variant);
        if (data?.extract && data.lang === 'es') {
          setSummary(data.extract);
          break;
        }
      }

      setLoading(false);
    };

    getSummary();
  }, [name]);

  return { summary, loading };
};

export default useWikipediaArtistSummary;
