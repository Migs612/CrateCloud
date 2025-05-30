import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../hooks/firebase';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = () =>
    displayName.trim() !== '' &&
    email.trim() !== '' &&
    password !== '' &&
    confirmPassword !== '' &&
    password === confirmPassword &&
    isEmailValid(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const checkUsername = await fetch(`http://localhost:4000/api/auth/username-exists/${displayName}`);
      if (checkUsername.status === 200) {
        setError("Ese nombre de usuario ya está en uso");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: email,
          username: displayName,
          displayName: displayName
        }),
      });

      setSuccessPopup(true);
      setTimeout(() => {
        navigate('/loginpage');
      }, 2000);
    } catch (err) {
      setError("Error al crear la cuenta");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-white overflow-x-hidden">
      {/* 🎨 Fondo dinámico desde ThemeContext */}
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

      <div
        className="glass rounded-xl shadow-xl w-full max-w-md z-10 p-10 border backdrop-blur-lg"
        style={{
          backgroundColor: 'hsl(var(--color-primary-dark)/0.3)',
          borderColor: 'hsl(var(--color-primary)/0.2)'
        }}
      >
        <h2 className="text-3xl font-bold font-unbounded mb-6 text-center text-[hsl(var(--color-primary-soft))]">
          Crea tu cuenta
        </h2>

        {error && (
          <p className="text-sm mb-4 text-center text-[hsl(0 60% 70%)]">{error}</p>
        )}

        {successPopup && (
          <div className="text-sm mb-4 text-center text-[hsl(140 60% 60%)] bg-[hsl(140 60% 20%)] p-2 rounded-lg">
            Cuenta registrada correctamente. Redirigiendo...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="Tu nombre visible"
              className="w-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.3)] rounded-lg p-3 text-white placeholder-[hsl(var(--color-primary-soft)/0.6)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.5)]"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className={`w-full bg-[hsl(var(--color-primary)/0.1)] border rounded-lg p-3 text-white placeholder-[hsl(var(--color-primary-soft)/0.6)] focus:outline-none focus:ring-2 ${
                isEmailValid(email)
                  ? 'border-[hsl(var(--color-primary)/0.3)] focus:ring-[hsl(var(--color-primary)/0.5)]'
                  : 'border-red-400 focus:ring-red-400'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.3)] rounded-lg p-3 text-white placeholder-[hsl(var(--color-primary-soft)/0.6)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.5)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full bg-[hsl(var(--color-primary)/0.1)] border rounded-lg p-3 text-white placeholder-[hsl(var(--color-primary-soft)/0.6)] focus:outline-none focus:ring-2 ${
                confirmPassword === password
                  ? 'border-[hsl(var(--color-primary)/0.3)] focus:ring-[hsl(var(--color-primary)/0.5)]'
                  : 'border-red-400 focus:ring-red-400'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full font-semibold py-3 rounded-lg transition-all shadow-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-white shadow-[hsl(var(--color-primary-dark)/0.2)]'
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/loginpage" className="text-[hsl(var(--color-primary-soft))] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
