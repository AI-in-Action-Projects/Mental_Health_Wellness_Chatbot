import React, { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  type: 'listening' | 'speaking';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, type }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBars([]);
      return;
    }

    const interval = setInterval(() => {
      const newBars = Array.from({ length: 7 }, () => Math.random() * 100);
      setBars(newBars);
    }, 120);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const colorClasses = type === 'listening' 
    ? ['bg-red-400', 'bg-red-500', 'bg-red-600'] 
    : ['bg-blue-400', 'bg-blue-500', 'bg-blue-600'];

  return (
    <div className="flex items-center justify-center space-x-1 h-12 px-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className={`w-1.5 ${colorClasses[index % colorClasses.length]} rounded-full transition-all duration-150 ease-out shadow-sm`}
          style={{
            height: `${Math.max(8, (bars[index] || 0) * 0.32)}px`,
            opacity: isActive ? 0.9 : 0.3,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};