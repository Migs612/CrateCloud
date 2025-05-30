import React, { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../hooks/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/usuario');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/usuario');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = result.user;

      const response = await fetch(`http://localhost:4000/api/auth/check/${uid}`);
      if (response.status === 404) {
        navigate('/elegir-nombre', {
          state: { uid, email, displayName },
        });
      } else {
        navigate('/usuario');
      }
    } catch (err) {
      setError('Error con Google');
    }
  };

  const handleGitHubLogin = () => {
    setError('Inicio de sesión con GitHub no está habilitado por ahora.');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-white overflow-x-hidden">
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
          Inicia Sesión
        </h2>

        {error && (
          <p className="text-sm mb-4 text-center text-[hsl(0 60% 70%)]">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.3)] rounded-lg p-3 text-white placeholder-[hsl(var(--color-primary-soft)/0.6)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.5)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[hsl(var(--color-primary-soft))] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-dark))] text-white font-semibold py-3 rounded-lg transition-all shadow-md shadow-[hsl(var(--color-primary-dark)/0.2)]"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <span className="text-sm text-[hsl(var(--color-primary-soft)/0.7)]">
            o inicia sesión con
          </span>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleGoogleLogin}
            className="bg-white p-2 rounded-full hover:bg-gray-200 transition"
            title="Google"
          >
            <FaGoogle className="text-red-500 text-xl" />
          </button>

          <button
            onClick={handleGitHubLogin}
            className="bg-gray-400 p-2 rounded-full cursor-not-allowed opacity-60"
            title="GitHub deshabilitado"
          >
            <FaGithub className="text-black text-xl" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link
            to="/registerpage"
            className="text-[hsl(var(--color-primary-soft))] hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
