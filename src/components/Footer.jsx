import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center text-sm text-gray-400 py-8 px-4 border-t border-purple-900 mt-16">
      <p className="italic text-white mb-2">
        “Esto no es solo lo que suena. Es lo que te representa.”
      </p>
      <div className="space-x-4">
        <a href="#" className="hover:text-purple-400 transition">Sobre</a>
        <a href="#" className="hover:text-purple-400 transition">Comunidad</a>
        <a href="#" className="hover:text-purple-400 transition">Legal</a>
      </div>
    </footer>
  );
};

export default Footer;
