import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Keyboard } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface VoiceMessageInputProps {
  onSendMessage: (content: string) => void;
  isAISpeaking: boolean;
  onStopSpeaking: () => void;
  isDarkMode?: boolean;
  inputMode: 'voice' | 'text';
  onInputModeChange: (mode: 'voice' | 'text') => void;
}

export const VoiceMessageInput: React.FC<VoiceMessageInputProps> = ({ 
  onSendMessage, 
  isAISpeaking,
  onStopSpeaking,
  isDarkMode = false,
  inputMode,
  onInputModeChange
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [speechSupported] = useState(voiceService.isSpeechRecognitionSupported());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      if (inputMode === 'text') {
        textareaRef.current?.focus();
      }
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      onSendMessage(transcript);
      setIsListening(false);
    }
  };

  const handleStartListening = () => {
    if (inputMode !== 'voice') return;
    
    if (isAISpeaking) {
      voiceService.stopCurrentAudio();
      onStopSpeaking();
    }

    voiceService.startListening(
      handleVoiceTranscript,
      setIsListening
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const switchToTextMode = () => {
    onInputModeChange('text');
    if (isListening) {
      handleStopListening();
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const switchToVoiceMode = () => {
    onInputModeChange('voice');
    setMessage('');
  };

  useEffect(() => {
    if (inputMode === 'text' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message, inputMode]);

  useEffect(() => {
    return () => {
      voiceService.stopListening();
      voiceService.stopCurrentAudio();
    };
  }, []);

  useEffect(() => {
    if (inputMode === 'text') {
      if (isListening) {
        handleStopListening();
      }
      if (isAISpeaking) {
        voiceService.stopCurrentAudio();
        onStopSpeaking();
      }
    }
  }, [inputMode, isListening, isAISpeaking, onStopSpeaking]);

  return (
    <div className="space-y-3">
      {/* Main Input Area - Compact */}
      <div className="relative">
        {inputMode === 'voice' ? (
          /* Compact Voice Input Mode */
          <div className={`rounded-2xl border shadow-lg p-4 backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-slate-800/80 border-white/20' 
              : 'bg-white/90 border-gray-200'
          }`}>
            {/* Voice Status - Compact */}
            <div className="text-center mb-4">
              {isListening ? (
                <div className={`flex items-center justify-center space-x-2 ${
                  isDarkMode ? 'text-orange-300' : 'text-orange-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium">Listening...</span>
                </div>
              ) : (
                <span className={`text-sm ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  {speechSupported ? 'Tap to speak' : 'Speech not supported'}
                </span>
              )}
            </div>

            {/* Compact Voice Control Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isAISpeaking || !speechSupported}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                  ${isListening 
                    ? isDarkMode
                      ? 'bg-orange-500 text-white animate-pulse' 
                      : 'bg-orange-500 text-white animate-pulse'
                    : isAISpeaking || !speechSupported
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-orange-500 text-white hover:shadow-xl'
                      : 'bg-orange-500 text-white hover:shadow-xl'
                  }
                `}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>

            {/* Mode Switch */}
            <div className="flex justify-center">
              <button
                onClick={switchToTextMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs ${
                  isDarkMode 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Keyboard size={14} />
                <span>Switch to typing</span>
              </button>
            </div>
          </div>
        ) : (
          /* Compact Text Input Mode */
          <form onSubmit={handleSubmit} className="relative">
            <div className={`flex items-end space-x-3 p-3 border rounded-2xl shadow-lg focus-within:shadow-xl transition-all duration-300 backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-slate-800/80 border-white/20 focus-within:border-orange-400' 
                : 'bg-white/90 border-gray-200 focus-within:border-orange-400'
            }`}>
              {/* Text Input */}
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  rows={1}
                  className={`w-full resize-none border-0 focus:outline-none focus:ring-0 bg-transparent max-h-24 text-sm leading-relaxed placeholder-opacity-70 ${
                    isDarkMode 
                      ? 'text-white placeholder-orange-300' 
                      : 'text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Switch to Voice Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={switchToVoiceMode}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'text-orange-300 hover:text-white hover:bg-orange-500/20' 
                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                )}
                
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    message.trim()
                      ? isDarkMode
                        ? 'bg-orange-500 text-white hover:shadow-lg'
                        : 'bg-orange-500 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Compact Mode Indicator */}
      <div className="flex justify-center">
        <div className={`flex items-center space-x-4 rounded-lg px-3 py-1 text-xs ${
          isDarkMode 
            ? 'bg-slate-800/60 text-gray-300' 
            : 'bg-white/60 text-gray-500'
        }`}>
          <div className={`flex items-center space-x-1 ${
            inputMode === 'voice' 
              ? isDarkMode ? 'text-orange-300 font-medium' : 'text-orange-600 font-medium'
              : ''
          }`}>
            <Mic size={12} />
            <span>Voice</span>
          </div>
          <div className={`w-px h-3 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center space-x-1 ${
            inputMode === 'text' 
              ? isDarkMode ? 'text-orange-300 font-medium' : 'text-orange-600 font-medium'
              : ''
          }`}>
            <Keyboard size={12} />
            <span>Text</span>
          </div>
        </div>
      </div>
    </div>
  );
};