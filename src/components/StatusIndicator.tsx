import React from 'react';
import { Wifi, WifiOff, Bot, NutOff as BotOff } from 'lucide-react';

interface StatusIndicatorProps {
  isOnline: boolean;
  aiEnabled: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline, aiEnabled }) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi size={14} className="text-green-500" />
        ) : (
          <WifiOff size={14} className="text-gray-400" />
        )}
        <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {aiEnabled ? (
          <Bot size={14} className="text-blue-500" />
        ) : (
          <BotOff size={14} className="text-gray-400" />
        )}
        <span className={`text-xs ${aiEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
          {aiEnabled ? 'AI Active' : 'AI Disabled'}
        </span>
      </div>
    </div>
  );
};