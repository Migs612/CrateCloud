import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Album from './pages/Album'; // Importamos la vista del álbum

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" element={<Album />} />
      </Routes>
    </Router>
  );
}

export default App;
