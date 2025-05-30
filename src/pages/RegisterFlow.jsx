import React, { useState } from 'react';
import WelcomeScreen from '../components/Register/WelcomeScreen';
import PersonalizeScreen from '../components/Register/PersonalizeScreen';
import ConfirmationScreen from '../components/Register/ConfirmationScreen';
import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';

const RegisterFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    spotifyProfile: null,
    favoriteArtists: [],
    favoriteAlbums: []
  });

  const handleSpotifyAuth = (profile) => {
    setUserData(prev => ({ ...prev, spotifyProfile: profile }));
    setCurrentStep(2);
  };

  const handlePersonalization = (artists, albums) => {
    setUserData(prev => ({ 
      ...prev, 
      favoriteArtists: artists,
      favoriteAlbums: albums 
    }));
    setCurrentStep(3);
  };

  const handleComplete = () => {
    // Aquí se crearía el perfil del usuario y se redirigiría al dashboard
    console.log('Usuario registrado:', userData);
    window.location.href = '/usuario';
  };

  return (
    <div className="flex-1 w-[90%] lg:w-[80%] mx-auto mb-12 text-white min-h-screen">
      <Navbar/>
      {currentStep === 1 && (
        <WelcomeScreen onSpotifyAuth={handleSpotifyAuth} />
      )}
      {currentStep === 2 && (
        <PersonalizeScreen 
          onComplete={handlePersonalization}
          spotifyProfile={userData.spotifyProfile}
        />
      )}
      {currentStep === 3 && (
        <ConfirmationScreen 
          userData={userData}
          onComplete={handleComplete}
        />
      )}
      <Footer/>
    </div>
  );
};

export default RegisterFlow;