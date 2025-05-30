import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiPlusCircle, FiMenu, FiX, FiDisc, FiUsers, FiMusic
} from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import { auth } from '../../hooks/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import useSpotifyAppToken from '../../hooks/useSpotifyAppToken';
import ColorPicker from '../Global/ColorPicker';

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [username, setUsername] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarColorPicker, setMostrarColorPicker] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const busquedaRef = useRef(null);
  const token = useSpotifyAppToken();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);
      if (user) {
        localStorage.setItem('uid', user.uid);

        try {
          const res = await fetch(`http://localhost:4000/api/users/${user.uid}`);
          const data = await res.json();
          if (data.username) {
            setUsername(data.username);
          }
        } catch (err) {
          console.error('Error al obtener el username:', err);
        }
      } else {
        localStorage.removeItem('uid');
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMostrarMenu(false);
      if (busquedaRef.current && !busquedaRef.current.contains(event.target)) setResultados([]);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
    setUsuario(null);
    setMostrarMenu(false);
    navigate('/loginpage');
  };

  const handleBuscar = async (value) => {
    setQuery(value);
    if (!value.trim() || !token) return setResultados([]);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(value)}&type=album,artist&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      if (!res.ok) throw new Error('Respuesta no válida de Spotify');
      const data = await res.json();
      const resultados = [
        ...(data.albums?.items || []),
        ...(data.artists?.items || []),
      ];
      setResultados(resultados);
    } catch (err) {
      console.error('Error de búsqueda:', err);
      setResultados([]);
    }
  };

  const opciones = [
    { nombre: 'ÁLBUMES', ruta: '/Albums', icono: FiDisc },
    { nombre: 'LISTAS', ruta: '/Lists', icono: FiMusic },
    { nombre: 'AMIGOS', ruta: '/Amigos', icono: FiUsers },
  ];

  const isActiveRoute = (ruta) => location.pathname === ruta;

  return (
    <>
      <nav
        className="w-[80%] mx-auto mt-6 rounded-2xl backdrop-blur-md shadow-lg relative z-[100]"
        style={{
          color: 'white',
          backgroundColor: 'hsl(var(--color-primary-dark)/0.1)',
          border: '2px solid hsl(var(--color-primary)/0.4)',
        }}
      >
        <div className="hidden lg:grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1.2fr_auto_auto] grid-rows-[auto_auto] relative z-10 gap-0">
          {/* Logo */}
          <Link
            to="/"
            className="row-span-2 flex items-center justify-center border-r-2 group/logo hover:bg-white/5 transition-all duration-300"
            style={{ borderColor: 'hsl(var(--color-primary)/0.6)' }}
          >
            <div className="flex items-center space-x-3 text-2xl font-bold cursor-pointer transform group-hover/logo:scale-105 transition-transform duration-300">
              <div
                className="w-8 h-8 rounded-full relative overflow-hidden flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--color-primary-light)), hsl(var(--color-primary)), hsl(var(--color-primary-dark)))',
                  boxShadow: '0 4px 12px hsl(var(--color-primary)/0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                <FiDisc className="text-white/90 text-lg relative z-10" />
              </div>
              <span className="font-unbounded text-2xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                CrateCloud
              </span>
            </div>
          </Link>

          {/* Usuario con menú desplegable original */}
          <div className="relative">
            <div
              onClick={() => usuario && setMostrarMenu(!mostrarMenu)}
              className="flex items-center justify-center text-sm font-semibold border-r-2 border-b-2 hover:bg-white/10 cursor-pointer h-full relative"
              style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
            >
              {usuario ? (
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-base" />
                  <span>{username}</span>
                </div>
              ) : (
                <Link
                  to="/loginpage"
                  className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
                >
                  <HiHome className="text-base" />
                  USUARIO
                </Link>
              )}
            </div>


            {usuario && mostrarMenu && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 mt-1 text-white rounded shadow-lg z-[9999] w-40"
                style={{
                  backgroundColor: 'hsl(var(--color-primary-dark)/0.5)',
                  border: '1px solid hsl(var(--color-primary)/0.3)'
                }}
              >
                <button
                  onClick={() => {
                    navigate('/usuario');
                    setMostrarMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10"
                  type="button"
                >
                  Ir al perfil
                </button>
                <button
                  onClick={() => {
                    cerrarSesion();
                    setMostrarMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          {opciones.map(({ nombre, ruta, icono: Icon }, i) => (
            <Link
              key={i}
              to={ruta}
              className={`flex items-center justify-center text-sm font-semibold border-r-2 border-b-2 cursor-pointer transition-all group/nav relative overflow-hidden
              ${isActiveRoute(ruta) ? 'bg-white/15' : 'hover:bg-white/10'}`}
              style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
            >
              {isActiveRoute(ruta) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse z-[1]" />
              )}
              <div className="flex items-center space-x-2 z-10">
                <Icon className="text-base" />
                <span>{nombre}</span>
              </div>
            </Link>
          ))}

          {/* Color Picker */}
          <div
            className="flex col-start-7 items-center justify-center w-12 h-12 border-b-2 cursor-pointer hover:bg-white/10 relative group"
            onClick={() => setMostrarColorPicker(true)}
            style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
          >
            <i className="ri-color-filter-fill text-lg z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <Link
            to="/createchart"
            className="col-span-2 col-start-2 row-start-2 flex items-center justify-center text-white text-sm font-semibold py-2 transition-all hover:bg-white/10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))',
              borderTop: '1px solid hsl(var(--color-primary)/0.2)',
              borderBottom: '1px solid hsl(var(--color-primary)/0.2)',
            }}
          >
            <FiPlusCircle className="mr-2" />
            CREAR
          </Link>


          {/* Buscador */}
          <div className="col-span-3 row-start-2 flex items-center border-r-2 px-4 relative z-[9999]" ref={busquedaRef}
            style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
          >
            {mostrarBusqueda && (
              <div className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleBuscar(e.target.value)}
                  placeholder="Buscar álbum o artista..."
                  className="bg-transparent outline-none placeholder-white text-sm w-full border-b-2"
                  style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
                />
                {resultados.length > 0 && (
                  <div className="absolute top-full mt-2 right-0 w-full bg-black/90 rounded-lg shadow-lg z-[9999] text-white border border-white/10 max-h-80 overflow-auto">
                    {resultados.map((item) => (
                      <Link
                        key={item.id}
                        to={item.type === 'album' ? `/album/${item.id}` : `/artist/${item.id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-all"
                        onClick={() => {
                          setResultados([]);
                          setQuery('');
                          setMostrarBusqueda(false);
                        }}
                      >
                        {item.images?.[0]?.url && (
                          <img src={item.images[0].url} alt={item.name} className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="text-sm truncate">{item.name}</span>
                        <span className="text-xs text-white/40">({item.type})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lupa animada */}
          <div
            className="row-start-2 col-span-1 flex items-center justify-center w-12 h-12 cursor-pointer transition-all duration-300 group/search relative overflow-hidden hover:bg-white/10"
            onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
            title="Buscar"
          >
            <FiSearch
              className={`transform transition-all duration-300 ${mostrarBusqueda ? 'rotate-90 scale-110' : 'rotate-0 scale-100'} group-hover/search:scale-125`}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover/search:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Móvil */}
        <div className="lg:hidden flex justify-between items-center p-4 relative z-10">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FiDisc className="text-white/90 text-lg" />
            <span className="font-unbounded bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              CrateCloud
            </span>
          </Link>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2"
          >
            {menuAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {menuAbierto && (
          <div
            className="lg:hidden text-sm font-medium border-t-2 relative z-10 animate-in slide-in-from-top-2 duration-300"
            style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
          >
            {usuario && (
              <button
                onClick={() => {
                  navigate('/usuario');
                  setMenuAbierto(false);
                }}
                className="block w-full text-left px-4 py-3 border-b hover:bg-white/10"
                style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
              >
                Ir al perfil
              </button>
            )}

            {!usuario && (
              <Link
                to="/loginpage"
                onClick={() => setMenuAbierto(false)}
                className="block px-4 py-3 border-b hover:bg-white/10"
                style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
              >
                Iniciar sesión
              </Link>
            )}

            {opciones.map(({ nombre, ruta, icono: Icon }, index) => (
              <Link
                key={index}
                to={ruta}
                onClick={() => setMenuAbierto(false)}
                className={`block px-4 py-3 border-b hover:bg-white/10 ${isActiveRoute(ruta) ? 'bg-white/5' : ''}`}
                style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="text-base" />
                  <span>{nombre}</span>
                </div>
              </Link>
            ))}

            <Link
              to="/createchart"
              onClick={() => setMenuAbierto(false)}
              className="px-4 py-3 border-b flex items-center space-x-2 hover:bg-white/10"
              style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
            >
              <FiPlusCircle />
              <span>CREAR</span>
            </Link>

            <div
              className="px-4 py-3 flex items-center border-b hover:bg-white/10 cursor-pointer"
              onClick={() => {
                setMostrarColorPicker(true);
                setMenuAbierto(false);
              }}
              style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
            >
              <i className="ri-color-filter-fill text-base"></i>
              <span>Personalizar colores</span>
            </div>

            {usuario && (
              <button
                onClick={cerrarSesion}
                className="block w-full text-left px-4 py-3 border-b hover:bg-red-500/20"
                style={{ borderColor: 'hsl(var(--color-primary)/0.4)' }}
              >
                <div className="flex items-center space-x-2">
                  <FiX className="text-base" />
                  <span>Cerrar sesión</span>
                </div>
              </button>
            )}
          </div>
        )}
      </nav>

      {mostrarColorPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
          onClick={() => setMostrarColorPicker(false)}
        >
          <div
            className="bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[560px] max-w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMostrarColorPicker(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            <ColorPicker variant="1" />
          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;
