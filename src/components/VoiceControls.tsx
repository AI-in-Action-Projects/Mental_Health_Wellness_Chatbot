import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface VoiceControlsProps {
  onTranscript: (transcript: string) => void;
  isAISpeaking: boolean;
  onStopSpeaking: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onTranscript,
  isAISpeaking,
  onStopSpeaking
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported] = useState(voiceService.isSpeechRecognitionSupported());
  const [voiceEnabled] = useState(voiceService.isVoiceSynthesisEnabled());

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      voiceService.stopListening();
      voiceService.stopCurrentAudio();
    };
  }, []);

  const handleStartListening = () => {
    if (isAISpeaking) {
      voiceService.stopCurrentAudio();
      onStopSpeaking();
    }

    voiceService.startListening(
      (transcript) => {
        onTranscript(transcript);
        setIsListening(false);
      },
      (listening) => {
        setIsListening(listening);
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleToggleMute = () => {
    if (isAISpeaking) {
      voiceService.stopCurrentAudio();
      onStopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  const handleStopSpeaking = () => {
    voiceService.stopCurrentAudio();
    onStopSpeaking();
  };

  if (!speechSupported && !voiceEnabled) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700">
          Voice features are not supported in your browser. You can still use text chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-xl">
      {/* Main Voice Button */}
      {speechSupported && (
        <div className="relative">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={isAISpeaking}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : isAISpeaking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          {isListening && (
            <div className="absolute -inset-2 rounded-full border-2 border-red-300 animate-ping"></div>
          )}
        </div>
      )}

      {/* Audio Controls */}
      {voiceEnabled && (
        <>
          <button
            onClick={handleToggleMute}
            className={`
              p-3 rounded-full transition-all duration-200
              ${isMuted 
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }
            `}
            title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {isAISpeaking && (
            <button
              onClick={handleStopSpeaking}
              className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all duration-200"
              title="Stop Speaking"
            >
              <Pause size={20} />
            </button>
          )}
        </>
      )}

      {/* Status Text */}
      <div className="text-sm text-gray-600 min-w-0">
        {isAISpeaking ? (
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>AI is speaking...</span>
          </span>
        ) : isListening ? (
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Listening...</span>
          </span>
        ) : (
          <span className="text-gray-500">
            {speechSupported ? 'Tap mic to speak' : 'Type your message'}
          </span>
        )}
      </div>
    </div>
  );
};