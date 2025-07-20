import React from 'react';
import { User } from '../types/chat';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  const statusSizes = {
    sm: 'w-2.5 h-2.5 border border-white',
    md: 'w-3 h-3 border-2 border-white',
    lg: 'w-3.5 h-3.5 border-2 border-white'
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <div
        className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[user.status]} rounded-full`}
      />
    </div>
  );
};