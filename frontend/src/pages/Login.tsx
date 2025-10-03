import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      
      // Get user from localStorage to determine role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === Role.SUPER_MANAGER) {
          navigate('/admin');
        } else if (user.role === Role.MANAGER) {
          navigate('/manager');
        } else {
          navigate('/employee');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
              <Calendar className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Urlaubsplanner</h1>
          <p className="text-primary-100 dark:text-gray-300">
            Mitarbeiter-Urlaubsverwaltung
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Anmelden
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benutzername
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Benutzername eingeben"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Passwort eingeben"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-semibold mb-2">
              Demo-Zugänge:
            </p>
            <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-gray-600 dark:text-gray-300">Mitarbeiter:</p>
              <p className="ml-2">• <span className="font-mono">max.mustermann / password</span></p>
              <p className="ml-2">• <span className="font-mono">sarah.mueller / password</span></p>
              <p className="ml-2">• <span className="font-mono">thomas.schmidt / password</span></p>
              
              <p className="font-semibold text-gray-600 dark:text-gray-300 mt-2">Manager:</p>
              <p className="ml-2">• <span className="font-mono">michael.klein / password</span></p>
              
              <p className="font-semibold text-primary-600 dark:text-primary-400 mt-2">Super Manager:</p>
              <p className="ml-2">• <span className="font-mono">admin / password</span></p>
            </div>
          </div>
        </div>
        
        {/* Footer Branding */}
        <div className="mt-8 text-center bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-white dark:text-gray-200">
            Built by <span className="font-bold text-white">Serhat Bilge</span> for Showcase Applications
          </p>
          <p className="text-xs text-white/80 dark:text-gray-300 mt-1">
            <a href="https://github.com/Serhat17" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">
              github.com/Serhat17
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
