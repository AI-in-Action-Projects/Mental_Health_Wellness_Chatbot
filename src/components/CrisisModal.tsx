import React from 'react';
import { X, Phone, Heart, Shield, ExternalLink } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  if (!isOpen) return null;

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support in English and Spanish",
      type: "call"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      type: "text"
    },
    {
      name: "International Association for Suicide Prevention",
      number: "Visit iasp.info/resources",
      description: "Crisis centers worldwide",
      type: "web"
    },
    {
      name: "Emergency Services",
      number: "911 (US) / 112 (EU) / 000 (AU)",
      description: "Immediate emergency assistance",
      type: "emergency"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
      <div className={`rounded-3xl w-full max-w-2xl mx-auto shadow-3xl max-h-[95vh] overflow-y-auto ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20' 
          : 'bg-white'
      }`}>
        {/* Enhanced Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 sm:p-8 border-b rounded-t-3xl ${
          isDarkMode 
            ? 'border-white/20 bg-gradient-to-r from-red-900/50 to-pink-900/50' 
            : 'border-gray-200 bg-gradient-to-r from-red-50 to-pink-50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Crisis Support Available</h2>
              <p className={`text-sm sm:text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>You don't have to face this alone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`transition-all duration-300 p-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white'
            }`}
            title="Close and continue conversation"
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="currentColor" />
              <h3 className={`text-lg sm:text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Your life has immense value</h3>
            </div>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              I'm deeply concerned about what you've shared. While I'm here to support you, 
              professional crisis counselors are specially trained to help with thoughts of self-harm. 
              Please reach out to one of these resources for immediate, compassionate support:
            </p>
          </div>

          {/* Enhanced Crisis Resources */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            {crisisResources.map((resource, index) => (
              <div key={index} className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-white/20 hover:border-white/30' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    resource.type === 'emergency' ? 'bg-red-100 text-red-600' :
                    resource.type === 'call' ? 'bg-blue-100 text-blue-600' :
                    resource.type === 'text' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {resource.type === 'emergency' || resource.type === 'call' ? (
                      <Phone size={16} className="sm:w-5 sm:h-5" />
                    ) : resource.type === 'text' ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    ) : (
                      <ExternalLink size={16} className="sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold mb-2 text-sm sm:text-base ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{resource.name}</h4>
                    <p className={`font-mono text-base sm:text-lg mb-2 break-all ${
                      resource.type === 'emergency' ? 'text-red-600' :
                      resource.type === 'call' ? 'text-blue-600' :
                      resource.type === 'text' ? 'text-green-600' :
                      'text-purple-600'
                    }`}>
                      {resource.number}
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{resource.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Support Message */}
          <div className={`rounded-2xl p-5 sm:p-6 border mb-6 sm:mb-8 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-700/50' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <h4 className={`font-bold mb-3 text-sm sm:text-base ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Remember, you are not alone:</h4>
            <ul className={`text-xs sm:text-sm space-y-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <li>• Crisis counselors are available 24/7 and genuinely want to help</li>
              <li>• These overwhelming feelings can be temporary, even when they feel endless</li>
              <li>• You deserve support, care, and compassion</li>
              <li>• Many people have felt this way and found their path to healing</li>
              <li>• Your story isn't over - there are chapters yet to be written</li>
            </ul>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:988"
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-bold flex items-center justify-center space-x-3 text-base sm:text-lg"
              >
                <Phone size={20} className="sm:w-6 sm:h-6" />
                <span>Call 988 Now</span>
              </a>
              <a
                href="sms:741741&body=HOME"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-bold flex items-center justify-center space-x-3 text-base sm:text-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Text 741741</span>
              </a>
            </div>
            <button
              onClick={onClose}
              className={`w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl transition-all duration-300 border-2 font-semibold text-base sm:text-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10 border-white/30 hover:border-white/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
              }`}
            >
              Continue our conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};