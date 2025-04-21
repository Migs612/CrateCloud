import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiGlobe, FiMenu, FiX, FiPlusCircle } from 'react-icons/fi';

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  return (
    <nav className="w-[80%] mx-auto mt-6 text-white border-2 border-white">
      {/* Vista escritorio */}
      <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto_auto] grid-rows-[auto_auto]">
        {/* LOGO */}
        <Link to="/" className="row-span-2 flex items-center justify-center border-r-2 border-white">
          <div className="flex items-center space-x-3 text-2xl font-bold cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full" />
            <span>CrateCloud</span>
          </div>
        </Link>

        {/* MENÚ PRINCIPAL */}
        <Link
          to="/usuario"
          className="flex items-center justify-center text-sm font-semibold border-r-2 border-b-2 border-white hover:bg-white/10 cursor-pointer"
        >
          USUARIO
        </Link>
        {['ALBUMES', 'TOP MÚSICA', 'AMIGOS'].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-sm font-semibold border-r-2 border-b-2 border-white hover:bg-white/10 cursor-pointer"
          >
            {item}
          </div>
        ))}

        {/* GLOBO */}
        <div className="flex items-center justify-center w-12 h-12 border-b-2 border-white">
          <FiGlobe size={20} />
        </div>

        {/* BOTÓN CREAR */}
        <div className="col-span-2 flex items-center justify-center border-r-2 border-white bg-purple-500 hover:bg-purple-600 transition-all">
          <button className="flex items-center space-x-2 font-semibold text-white text-sm px-4 py-2 focus:outline-none">
            <FiPlusCircle />
            <span>CREAR</span>
          </button>
        </div>

        {/* INPUT BUSCAR */}
        <div className="col-span-2 flex items-center border-r-2 border-white px-4">
          {mostrarBusqueda && (
            <div className="w-full border-b-2 border-white">
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent outline-none placeholder-white text-sm w-full max-w-[60%]"
              />
            </div>
          )}
        </div>

        {/* LUPA */}
        <div
          className="flex items-center justify-center w-12 h-12 cursor-pointer hover:bg-white/10"
          onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
        >
          <FiSearch />
        </div>
      </div>

      {/* Vista móvil */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-transparent border-t-2 border-white">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <div className="w-6 h-6 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full" />
          <span>CrateCloud</span>
        </Link>
        <button onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuAbierto && (
        <div className="lg:hidden bg-transparent text-sm font-medium border-t-2 border-white">
          <Link to="/usuario" className="block px-4 py-3 border-b border-white">
            USUARIO
          </Link>
          {['ALBUMES', 'TOP MÚSICA', 'AMIGOS'].map((item, index) => (
            <div key={index} className="px-4 py-3 border-b border-white">{item}</div>
          ))}
          <div className="px-4 py-3 border-b border-white flex items-center space-x-2">
            <FiPlusCircle />
            <span>CREAR</span>
          </div>
          <div className="flex px-4 py-3 items-center border-b border-white">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent flex-grow outline-none placeholder-white text-sm"
            />
            <FiSearch />
          </div>
          <div className="px-4 py-3 flex items-center">
            <FiGlobe />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
