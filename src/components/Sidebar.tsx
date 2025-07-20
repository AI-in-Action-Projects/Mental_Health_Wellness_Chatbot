import React from 'react';
import { X, RotateCcw, User, Heart, Sparkles, Quote } from 'lucide-react';
import { User as UserType } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  currentUser: UserType | null;
  isDarkMode?: boolean;
}

// Inspirational quotes for mental health
const inspirationalQuotes = [
  "You are enough, just as you are.",
  "Healing is not linear, and that's perfectly okay.",
  "Your mental health is a priority, not a luxury.",
  "Every small step forward is still progress.",
  "You have survived 100% of your difficult days so far.",
  "It's okay to rest and take care of yourself.",
  "Your feelings are valid and deserve attention.",
  "You are not alone in this journey.",
  "Growth happens outside your comfort zone.",
  "Be patient with yourself as you heal.",
  "Your story isn't over yet.",
  "You are worthy of love and compassion."
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSignOut,
  currentUser,
  isDarkMode = false
}) => {
  // Get a random quote
  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 sm:w-96 transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode 
          ? 'bg-slate-900 text-white' 
          : 'bg-gray-900 text-white'
        }
      `}>
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-orange-700/50' : 'border-orange-700/50'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl animate-float ${
                isDarkMode 
                  ? 'bg-orange-500' 
                  : 'bg-orange-500'
              }`}>
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Mental Health Matters</h2>
                <p className={`text-xs ${isDarkMode ? 'text-orange-300' : 'text-orange-300'}`}>
                  Personal Wellness Sanctuary
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors lg:hidden ${
                isDarkMode ? 'hover:bg-orange-800/50' : 'hover:bg-orange-800/50'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Inspirational Quotes Section */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 ${
                isDarkMode ? 'text-orange-300' : 'text-orange-300'
              }`}>
                Words of Encouragement
              </div>
              
              {/* Featured Quote */}
              <div className={`p-5 rounded-xl border backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-orange-800/30 border-orange-700/50' 
                  : 'bg-orange-800/30 border-orange-700/50'
              }`}>
                <div className="flex items-start space-x-3">
                  <Quote size={20} className={`flex-shrink-0 mt-1 ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-300'
                  }`} />
                  <p className="text-sm leading-relaxed italic text-white">
                    "{randomQuote}"
                  </p>
                </div>
              </div>

              {/* Additional Encouraging Messages */}
              <div className="space-y-3">
                {[
                  { icon: "💙", message: "Your courage to seek support shows your strength" },
                  { icon: "🌱", message: "Every conversation is a step toward growth" },
                  { icon: "🤗", message: "You deserve compassion, especially from yourself" },
                  { icon: "✨", message: "Your mental wellness journey is uniquely yours" },
                  { icon: "🌈", message: "There is hope, even in the darkest moments" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-3 p-4 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-orange-800/20' 
                        : 'hover:bg-orange-800/20'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-orange-100' : 'text-orange-100'
                    }`}>
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              {/* Gentle Reminder */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-orange-900/20 border-orange-700/50' 
                  : 'bg-orange-900/20 border-orange-700/50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={16} className={isDarkMode ? 'text-orange-300' : 'text-orange-300'} />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-orange-200' : 'text-orange-200'}`}>Gentle Reminder</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-orange-100' : 'text-orange-100'}`}>
                  Take your time. Share what feels comfortable. This is your safe space to express yourself freely.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced User Profile - No Email */}
          <div className={`border-t p-6 space-y-3 ${
            isDarkMode ? 'border-orange-700/50' : 'border-orange-700/50'
          }`}>
            {currentUser && (
              <div className={`flex items-center space-x-4 px-4 py-3 rounded-xl ${
                isDarkMode 
                  ? 'bg-orange-800/30 border border-orange-700/50' 
                  : 'bg-orange-800/30 border border-orange-700/50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDarkMode 
                    ? 'bg-orange-500' 
                    : 'bg-orange-500'
                }`}>
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className={`text-xs truncate ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-300'
                  }`}>Wellness Journey Member</p>
                </div>
              </div>
            )}
            
            <button
              onClick={onSignOut}
              className={`w-full flex items-center space-x-4 px-4 py-3 text-left rounded-xl transition-all duration-300 text-sm group ${
                isDarkMode 
                  ? 'hover:bg-orange-800/30 text-orange-300 hover:text-orange-200' 
                  : 'hover:bg-orange-800/30 text-orange-300 hover:text-orange-200'
              }`}
            >
              <RotateCcw size={18} className="flex-shrink-0" />
              <span>Start Fresh Conversation</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};