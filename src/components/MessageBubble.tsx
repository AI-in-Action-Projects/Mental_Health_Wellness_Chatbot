import React from 'react';
import { Message, User } from '../types/chat';
import { Heart, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  sender: User | undefined;
  showAvatar: boolean;
  isDarkMode?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  sender,
  showAvatar,
  isDarkMode = false
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex items-start space-x-4 sm:space-x-6 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''} group`}>
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0">
        {isOwn ? (
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white animate-float ${
            isDarkMode 
              ? 'bg-orange-500' 
              : 'bg-orange-500'
          }`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        ) : (
          <div className="relative">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white animate-float ${
              isDarkMode 
                ? 'bg-orange-500' 
                : 'bg-orange-500'
            }`}>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-300 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-3xl ${isOwn ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-full relative transform transition-all duration-300 hover:scale-[1.02] ${
          isOwn 
            ? isDarkMode
              ? 'bg-orange-600 text-white shadow-xl hover:shadow-2xl' 
              : 'bg-orange-500 text-white shadow-xl hover:shadow-2xl'
            : isDarkMode
              ? 'bg-slate-800/90 text-white shadow-xl border border-white/10 backdrop-blur-sm hover:shadow-2xl' 
              : 'bg-white text-gray-900 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-gray-200'
        } rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-6`}>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Enhanced message decoration */}
          {!isOwn && (
            <div className={`absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full opacity-60 animate-pulse ${
              isDarkMode 
                ? 'bg-orange-400' 
                : 'bg-orange-400'
            }`}></div>
          )}
          
          {/* Floating sparkles for AI messages */}
          {!isOwn && (
            <>
              <div className={`absolute -top-2 -right-2 w-1 h-1 rounded-full animate-ping ${
                isDarkMode ? 'bg-orange-300' : 'bg-orange-300'
              }`} style={{ animationDelay: '0s' }}></div>
              <div className={`absolute top-1 -left-2 w-1 h-1 rounded-full animate-ping ${
                isDarkMode ? 'bg-orange-400' : 'bg-orange-400'
              }`} style={{ animationDelay: '1s' }}></div>
            </>
          )}
        </div>
        
        <div className={`mt-2 sm:mt-3 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 ${
          isOwn ? 'text-right' : 'text-left'
        } ${isDarkMode ? 'text-orange-300' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
          {message.edited && ' • edited'}
        </div>
      </div>
    </div>
  );
};