import React, { useState } from 'react';
import { X, Lock, User, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (name: string, password: string) => Promise<{ success: boolean; error?: any }>;
  onSignUp: (name: string, password: string) => Promise<{ success: boolean; error?: any }>;
  isDarkMode?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  isDarkMode = false
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await onSignUp(name, password);
      } else {
        result = await onSignIn(name, password);
      }

      if (result.success) {
        onClose();
        setName('');
        setPassword('');
      } else {
        setError(result.error?.message || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`rounded-3xl w-full max-w-md mx-auto shadow-3xl max-h-[95vh] overflow-y-auto ${
        isDarkMode 
          ? 'bg-slate-800 border border-white/20' 
          : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 sm:p-8 border-b ${
          isDarkMode ? 'border-white/20' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors p-2 rounded-xl ${
              isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className={`border rounded-xl px-4 py-3 text-sm ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-700/50 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              {isSignUp ? 'Your Name' : 'Name'}
            </label>
            <div className="relative">
              <User size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isSignUp ? "Enter your name" : "Enter your name"}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-white/20 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-transparent' 
                    : 'border-gray-200 focus:ring-orange-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-white/20 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-transparent' 
                    : 'border-gray-200 focus:ring-orange-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-base ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDarkMode
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
            }`}
          >
            {loading ? (
              'Please wait...'
            ) : (
              <span className="flex items-center justify-center">
                {isSignUp ? <UserPlus size={18} className="mr-2" /> : <LogIn size={18} className="mr-2" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className={`font-medium transition-colors ${
                isDarkMode 
                  ? 'text-orange-300 hover:text-orange-200' 
                  : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};