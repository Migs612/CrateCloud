import { useEffect, useState } from 'react';

const useWikipediaSummary = (title, artist) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const capitalizeAllWords = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
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

  const formatForWikipedia = (str) =>
    str.trim().replace(/\s+/g, '_');

  useEffect(() => {
    if (!title) return;

    const fetchSummary = async (lang, query) => {
      try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return { ...data, _variant: query };
      } catch (err) {
        console.warn(`Error en Wikipedia para: ${query}`, err);
        return null;
      }
    };

    const getSummary = async () => {
      setLoading(true);

      const base = title.trim();
      const cleanedBase = base
        .replace(/\s*\(.*?\)/g, '')       // Remove (Deluxe)
        .replace(/\s*\[.*?\]/g, '')       // Remove [Explicit]
        .replace(/\s*\-.*?$/, '')         // Remove " - Remastered"
        .trim();

      const lower = base.toLowerCase();
      const first = capitalizeFirst(lower);
      const allWords = capitalizeAllWords(lower);
      const commonFormat = capitalizeCommon(lower);

      const baseVariants = [
        lower,
        base,
        first,
        allWords,
        commonFormat,
        cleanedBase
      ];

      const variants = [
        ...baseVariants,
        ...baseVariants.map(v => `${v} (álbum)`),
        ...baseVariants.map(v => `${v} (disco)`),
        ...baseVariants.map(v => `${formatForWikipedia(v)}_(álbum)`),
        ...baseVariants.map(v => `${formatForWikipedia(v)}_(disco)`),
      ];

      if (artist) {
        const formattedArtist = formatForWikipedia(artist);
        baseVariants.forEach(v => {
          const formattedTitle = formatForWikipedia(v);
          variants.push(`${formattedTitle}_(álbum_de_${formattedArtist})`);
          variants.push(`${formattedTitle}_(disco_de_${formattedArtist})`);
        });
      }

      let bestMatch = null;
      let fallback = null;

      for (const variant of variants) {
        const data = await fetchSummary('es', variant);
        if (!data?.extract) continue;

        console.log('Wikipedia candidate:', variant, data.title, data.type);

        const isSafe = data.type !== 'disambiguation';
        const isMatch = variants.some(v => data.title?.toLowerCase() === v.toLowerCase());

        if (isSafe && isMatch) {
          bestMatch = data;
          break;
        } else if (isSafe && !bestMatch) {
          fallback = data;
        }
      }

      if (bestMatch) {
        setSummary(bestMatch.extract);
        console.log('Wikipedia summary ✅', bestMatch.title, bestMatch.content_urls?.desktop?.page);
      } else if (fallback) {
        setSummary(fallback.extract);
        console.log('Wikipedia fallback ⚠️', fallback.title, fallback.content_urls?.desktop?.page);
      } else {
        setSummary(null);
      }

      setLoading(false);
    };

    getSummary();
  }, [title, artist]);

  return { summary, loading };
};

export default useWikipediaSummary;
