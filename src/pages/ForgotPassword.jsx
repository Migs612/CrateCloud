import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../hooks/firebase';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('📧 Se ha enviado un correo para restablecer tu contraseña.');
    } catch (err) {
      setError('❌ Error al enviar el correo. Verifica tu email.');
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
          Recupera tu contraseña
        </h2>

        {message && (
          <p className="text-sm mb-4 text-center text-[hsl(140 60% 60%)]">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm mb-4 text-center text-[hsl(0 60% 70%)]">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">
              Email asociado a tu cuenta
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.3)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.5)] text-white placeholder-[hsl(var(--color-primary-soft)/0.6)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:brightness-110 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-[hsl(var(--color-primary-dark)/0.2)]"
          >
            Enviar enlace de recuperación
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            to="/loginpage"
            className="text-[hsl(var(--color-primary-soft))] hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
