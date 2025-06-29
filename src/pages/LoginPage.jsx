import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a2540] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1c3556] p-10 rounded-xl shadow-xl text-white">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Welcome to ENTNT</h2>
          <p className="text-sm opacity-70">Sign in to continue</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email <span className="text-red-300">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@entnt.in"
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password <span className="text-red-300">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-white">
          <h3 className="text-lg font-semibold mb-3 underline underline-offset-4 decoration-white/50">
            Test Credentials
          </h3>
          <div className="flex flex-col items-center text-sm opacity-90 font-mono">
            <div className="flex justify-center gap-3 w-full max-w-xs">
              <span className="flex-1 text-right">admin@entnt.in</span>
              <span className="text-white/60">/</span>
              <span className="flex-1 text-left">admin123</span>
            </div>
            <div className="flex justify-center gap-3 w-full max-w-xs">
              <span className="flex-1 text-right">inspector@entnt.in</span>
              <span className="text-white/60">/</span>
              <span className="flex-1 text-left">inspect123</span>
            </div>
            <div className="flex justify-center gap-3 w-full max-w-xs">
              <span className="flex-1 text-right">engineer@entnt.in</span>
              <span className="text-white/60">/</span>
              <span className="flex-1 text-left">engine123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
