import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Album from './pages/Album';
import Usuario from './pages/Usuario';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ElegirNombreUsuario from './pages/ElegirNombreUsuario';
import SpotifyCallback from './pages/SpotifyCallBack';
import LastfmCallback from './pages/LastfmCallBack';
import AlbumPreview from './pages/AlbumPreview';
import Albums from './pages/Albums';
import ArtistPage from './pages/ArtistPage';
import CreateChart from './pages/CreateChart';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Amigos from './pages/Amigos';
import SpotifyRegister from './pages/RegisterFlow';
import error404 from './pages/not-found';
 
import 'remixicon/fonts/remixicon.css';

function App() {
  return (
    <>
      {/* Popup global de notificaciones */}
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="/registerpage" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/elegir-nombre" element={<ElegirNombreUsuario />} />
          <Route path="/spotify-callback" element={<SpotifyCallback />} />
          <Route path="/lastfm-callback" element={<LastfmCallback />} />
          <Route path="/album-preview" element={<AlbumPreview />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/createchart" element={<CreateChart />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/lists/:id" element={<ListDetail />} />
          <Route path="/Amigos" element={<Amigos />} />
          <Route path="/SpotifyRegister" element={<SpotifyRegister />} />
          <Route path="/404" element={<error404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
