// src/components/Artista/ArtistInfo.jsx
import { useState, useEffect } from 'react';
import useLastFmAPI from '../../hooks/useLastFmAPI';
import useWikipediaArtistSummary from '../../hooks/useWikipediaArtistSummary';
import useTranslatedText from '../../hooks/useTranslatedText';

const ArtistInfo = ({ artistName, bio: initialBio = null, tags: spotifyTags = [] }) => {
  const [bio, setBio] = useState(initialBio);
  const [lastFmTags, setLastFmTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const callLastFm = useLastFmAPI();

  const { summary: wikiSummary, loading: wikiLoading } = useWikipediaArtistSummary(artistName);
  const translatedLastfm = useTranslatedText(wikiSummary ? null : bio);
  const finalBio = wikiSummary || translatedLastfm;

  useEffect(() => {
    const fetchBio = async () => {
      if (!artistName || bio || wikiSummary) {
        setLoading(false);
        return;
      }

      const data = await callLastFm('artist.getinfo', { artist: artistName });
      if (data?.artist?.bio?.content) {
        setBio(data.artist.bio.content);
      }

      setLoading(false);
    };

    fetchBio();
  }, [artistName, bio, callLastFm, wikiSummary]);

  useEffect(() => {
    if (spotifyTags.length > 0 || !artistName) return;

    const fetchTags = async () => {
      const data = await callLastFm('artist.gettoptags', { artist: artistName });
      if (data?.toptags?.tag) {
        const filteredTags = data.toptags.tag
          .filter((tag) => tag.count > 10)
          .slice(0, 4)
          .map((tag) => ({ name: tag.name }));
        setLastFmTags(filteredTags);
      }
    };

    fetchTags();
  }, [spotifyTags, artistName, callLastFm]);

  const cleanBio = (text) => {
    if (typeof text !== 'string') return '';
    return text
      .replace(/<a[^>]*>(.*?)<\/a>/g, '')
      .replace(/Read more on Last\.fm.*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const tagsToShow = spotifyTags.length > 0 ? spotifyTags.slice(0, 4) : lastFmTags;

  return (
    <section className="glass-rounded p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Sobre el artista</h2>

      <div className="mb-6 text-white/80">
        {loading || wikiLoading ? (
          <p className="text-white/50 text-sm">Cargando...</p>
        ) : finalBio ? (
          <p className="text-sm md:text-base leading-relaxed">{cleanBio(finalBio)}</p>
        ) : (
          <p className="text-white/50 text-sm">No hay biografía disponible para este artista.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">Géneros</h3>
        <div className="flex flex-wrap gap-2">
          {tagsToShow.length > 0 ? (
            tagsToShow.map((tag, index) => (
              <div
                key={index}
                className="backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                {tag.name}
              </div>
            ))
          ) : (
            <span className="text-white/50 text-sm">No hay géneros disponibles para este artista.</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistInfo;
