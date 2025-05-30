// Albums.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';
import useSpotifyAppToken from '../hooks/useSpotifyAppToken';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const genres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Electrónica', 'Jazz', 'Metal', 'Reggaeton'];
const years = ['2025', '2024', '2023', '2022', '2010s'];

const Albums = () => {
    const token = useSpotifyAppToken();
    const { color } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [nextUrl, setNextUrl] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const interleaveByArtist = (albumList) => {
        const grouped = {};
        albumList.forEach((album) => {
            const artist = album.artists?.[0]?.name || 'Desconocido';
            if (!grouped[artist]) grouped[artist] = [];
            grouped[artist].push(album);
        });

        const result = [];
        const keys = Object.keys(grouped);
        let index = 0;
        while (result.length < albumList.length) {
            for (const key of keys) {
                if (grouped[key][index]) {
                    result.push(grouped[key][index]);
                }
            }
            index++;
        }

        return result;
    };

    const fetchAlbumsByGenre = async (genre) => {
        try {
            const res = await fetch(
                `https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(genre)}"&type=artist&limit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();

            const sortedArtists = data.artists?.items?.sort((a, b) => b.followers.total - a.followers.total);
            if (!sortedArtists?.length) return [];

            let allAlbums = [];

            for (const artist of sortedArtists) {
                const albumsRes = await fetch(
                    `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=5`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const albumsData = await albumsRes.json();
                allAlbums.push(...(albumsData.items || []));
            }

            return allAlbums;
        } catch (error) {
            console.error('Error al buscar álbumes por género:', error);
            return [];
        }
    };

    const fetchAlbums = async (append = false, urlOverride = null) => {
        if (!token) return;

        try {
            let res;
            let fetched = [];

            if (urlOverride) {
                res = await fetch(urlOverride, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                fetched = data.albums?.items || [];
                setNextUrl(data.albums?.next || null);
            } else if (searchQuery) {
                res = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=album&limit=50`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                fetched = data.albums?.items || [];
                setNextUrl(data.albums?.next || null);
            } else if (selectedGenre) {
                const genreAlbums = await fetchAlbumsByGenre(selectedGenre);

                const filteredByYear = genreAlbums.filter((album) => {
                    const year = album.release_date?.split('-')[0];
                    if (selectedYear === '2010s') return parseInt(year) >= 2010 && parseInt(year) <= 2019;
                    return selectedYear ? year === selectedYear : true;
                });

                fetched = filteredByYear;
                setNextUrl(null);
            } else if (selectedYear) {
                const yearQuery = selectedYear === '2010s'
                    ? 'year:2010 OR year:2011 OR year:2012 OR year:2013 OR year:2014 OR year:2015 OR year:2016 OR year:2017 OR year:2018 OR year:2019'
                    : `year:${selectedYear}`;

                res = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(yearQuery)}&type=album&limit=50`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                fetched = data.albums?.items || [];
                setNextUrl(data.albums?.next || null);
            } else {
                res = await fetch(
                    `https://api.spotify.com/v1/search?q=year:2024&type=album&limit=50`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                fetched = data.albums?.items || [];
                setNextUrl(data.albums?.next || null);
            }

            const releaseFiltered = fetched.filter((album) => {
                const year = album.release_date?.split('-')[0];
                if (selectedYear === '2010s') return parseInt(year) >= 2010 && parseInt(year) <= 2019;
                return selectedYear ? year === selectedYear : true;
            });

            const finalAlbums = interleaveByArtist(releaseFiltered);

            setAlbums((prev) => (append ? [...prev, ...finalAlbums] : finalAlbums));
        } catch (err) {
            console.error('Error al buscar álbumes:', err);
        }
    };

    useEffect(() => {
        fetchAlbums(false);
    }, [token, searchQuery, selectedGenre, selectedYear]);

    const loadMoreAlbums = async () => {
        if (!nextUrl || loadingMore) return;
        setLoadingMore(true);
        await fetchAlbums(true, nextUrl);
        setLoadingMore(false);
    };

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden">
            <div
                className="fixed inset-0 -z-10 transition-all duration-1000"
                style={{
                    backgroundImage: 'var(--background-dynamic)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300% 300%',
                    backgroundAttachment: 'fixed',
                    animation: 'fondo-move 10s ease-in-out infinite, fondo-pulso 12s ease-in-out infinite'
                }}
            />

            <Navbar />

            <div className="pt-24 pb-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                        <h1 className="text-3xl md:text-4xl font-bold font-unbounded text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-soft))] to-[hsl(var(--color-primary-contrast))]">
                            Descubrir Álbumes
                        </h1>

                        <div className="w-full md:w-1/2 lg:w-1/3">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full h-12 bg-[hsl(var(--color-primary-dark)/0.08)] text-white placeholder-white/50 rounded-full px-5 pr-12 outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary-soft)/0.5)] border border-white/10 transition-all"
                                    placeholder="Buscar álbumes o artistas..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setSelectedGenre('');
                                        setSelectedYear('');
                                    }}
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                                    <i className="ri-search-line text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    <div className="md:col-span-3">
                        <div className="rounded-2xl p-6 border border-[hsl(var(--color-primary)/0.3)] bg-[hsl(var(--color-primary-solid)/0.05)] backdrop-blur-md">
                            <h3 className="font-unbounded font-semibold mb-4 text-xl">Filtros</h3>
                            <div className="space-y-6">

                                <div>
                                    <h4 className="text-sm font-semibold mb-3 text-white/80">Género</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {genres.map((genre, index) => (
                                            <button
                                                key={index}
                                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all text-center border 
                    ${selectedGenre === genre
                                                        ? 'bg-[hsl(var(--color-primary)/0.2)] text-[hsl(var(--color-primary-contrast))] border-[hsl(var(--color-primary)/0.3)] font-semibold shadow'
                                                        : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5'
                                                    }`}
                                                onClick={() => {
                                                    setSelectedGenre(genre === selectedGenre ? '' : genre);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-3 text-white/80">Año</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {years.map((year, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedYear(year === selectedYear ? '' : year);
                                                    setSearchQuery('');
                                                }}
                                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all text-center border ${selectedYear === year
                                                    ? 'bg-[hsl(var(--color-primary)/0.2)] text-[hsl(var(--color-primary-contrast))] border-[hsl(var(--color-primary)/0.3)] font-semibold shadow'
                                                    : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5'}`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Resultados con glass suave */}
                    <div className="md:col-span-9">
                        <h2 className="text-2xl font-unbounded font-semibold mb-6">
                            Resultados {searchQuery || selectedGenre || selectedYear ? 'de Búsqueda' : 'Populares'}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {albums.map((album) => (
                                <Link
                                    to={`/album/${album.id}`}
                                    key={album.id}
                                    className="rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] border border-[hsl(var(--color-primary)/0.2)] bg-[hsl(var(--color-primary-solid)/0.05)] backdrop-blur-md"
                                >
                                    <img
                                        src={album.images?.[0]?.url}
                                        alt={`${album.name} por ${album.artists?.[0]?.name}`}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-[hsl(var(--color-primary-contrast))] mb-1 truncate">{album.name}</h3>
                                        <p className="text-sm mt-2 px-2 py-1 rounded bg-[hsl(var(--color-primary-solid)/0.1)] backdrop-blur-sm text-white/90 w-fit">
                                            {album.artists?.[0]?.name} • {album.release_date?.split('-')[0]}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {nextUrl && (
                            <div className="text-center mt-10">
                                <button
                                    onClick={loadMoreAlbums}
                                    className="btn-primary rounded-full text-sm"
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'Cargando...' : 'Ver más'}
                                </button>
                            </div>
                        )}

                        {!albums.length && (
                            <div className="text-center text-white/50 py-10">
                                No se encontraron álbumes. Intenta otra búsqueda o ajusta los filtros.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Albums;