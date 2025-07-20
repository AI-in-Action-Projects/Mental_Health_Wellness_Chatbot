export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface ElevenLabsResponse {
  audio: ArrayBuffer;
}

class VoiceService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private currentAudio: HTMLAudioElement | null = null;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onTranscriptCallback: ((transcript: string) => void) | null = null;
  private onListeningStateCallback: ((isListening: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private isCurrentlySpeaking = false;
  private audioContext: AudioContext | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private shouldStop = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private lastSpeechTime = 0;
  private accumulatedTranscript = '';
  private SILENCE_TIMEOUT = 2000; // 2 seconds of silence before stopping

  // Christina - Calming yoga instructor voice (perfect for therapeutic conversations)
  private voiceId = 'Specify the voiceId'; // Christina - calm, soothing, therapeutic
  
  // Optimized settings for Christina's natural, calming speech
  private voiceSettings: VoiceSettings = {
    stability: 0.80, // Balanced stability for consistent calming tone
    similarity_boost: 0.88, // High similarity for authentic voice
    style: 0.10, // Gentle, soft style perfect for yoga/therapy
    use_speaker_boost: false // Disable to reduce potential distortion
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    this.initializeSpeechRecognition();
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      // Use higher sample rate for better quality
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100 // CD quality
      });
    } catch (error) {
    }
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Enhanced settings for better speech capture with natural pauses
      this.recognition.continuous = true; // RESTORED: Allow continuous listening
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.lastSpeechTime = Date.now();
        this.accumulatedTranscript = ''; // Reset transcript
        this.onListeningStateCallback?.(true);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.onListeningStateCallback?.(false);
        this.clearSilenceTimer();
        
        // Send accumulated transcript if we have one
        if (this.accumulatedTranscript.trim()) {
          this.onTranscriptCallback?.(this.accumulatedTranscript.trim());
          this.accumulatedTranscript = '';
        }
      };
      
      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Update last speech time when we get results
        this.lastSpeechTime = Date.now();
        this.clearSilenceTimer(); // Clear any existing timer
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Accumulate final transcripts
        if (finalTranscript.trim()) {
          this.accumulatedTranscript += finalTranscript + ' ';
        }
        
        // Start silence timer after receiving speech
        this.startSilenceTimer();
      };
      
      this.recognition.onspeechstart = () => {
        this.lastSpeechTime = Date.now();
        this.clearSilenceTimer();
      };
      
      this.recognition.onspeechend = () => {
        this.startSilenceTimer();
      };
      
      this.recognition.onerror = (event) => {
        
        // Don't treat these as real errors
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        
        this.isListening = false;
        this.onListeningStateCallback?.(false);
        this.clearSilenceTimer();
        
        // Handle specific error types with user-friendly messages
        let errorMessage = '';
        switch (event.error) {
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check your microphone connection and permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        this.onErrorCallback?.(errorMessage);
      };
    }
  }

  private startSilenceTimer() {
    this.clearSilenceTimer();
    
    this.silenceTimer = setTimeout(() => {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    }, this.SILENCE_TIMEOUT);
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  async synthesizeSpeech(text: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Voice synthesis is not available. Please configure your ElevenLabs API key in the .env file.');
    }

    try {
      // Stop any currently playing audio first
      this.stopCurrentAudio();
      this.isCurrentlySpeaking = true;
      this.shouldStop = false;

      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg', // Request MP3 format for better compatibility
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2', // Use newer, higher quality model
          voice_settings: this.voiceSettings,
          output_format: 'mp3_44100_128' // High quality MP3 format
        })
      });

      if (!response.ok) {
        let errorMessage = `ElevenLabs API error: ${response.status}`;
        
        // Provide more specific error messages based on status code
        switch (response.status) {
          case 401:
            errorMessage = 'Invalid ElevenLabs API key. Please check your API key configuration in the .env file.';
            break;
          case 403:
            errorMessage = 'ElevenLabs API access forbidden. Please check your API key permissions.';
            break;
          case 429:
            errorMessage = 'ElevenLabs API rate limit exceeded. Please try again later.';
            break;
          case 500:
            errorMessage = 'ElevenLabs API server error. Please try again later.';
            break;
        }
        
        throw new Error(errorMessage);
      }

      // Check if we should stop before processing audio
      if (this.shouldStop) {
        this.isCurrentlySpeaking = false;
        return;
      }

      const audioBuffer = await response.arrayBuffer();

      // Check again if we should stop
      if (this.shouldStop) {
        this.isCurrentlySpeaking = false;
        return;
      }

      // Always use HTML5 audio for better compatibility and quality
      await this.playWithHTMLAudio(audioBuffer);

    } catch (error) {
      this.isCurrentlySpeaking = false;
      throw error;
    }
  }

  private async playWithHTMLAudio(audioBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if we should stop
      if (this.shouldStop) {
        this.isCurrentlySpeaking = false;
        resolve();
        return;
      }

      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.currentAudio = new Audio(audioUrl);
      
      // Optimize audio settings for quality
      this.currentAudio.volume = 0.85; // Slightly lower volume to prevent distortion
      this.currentAudio.preload = 'auto';
      
      // Add error handling for audio loading
      this.currentAudio.onloadeddata = () => {
      };
      
      this.currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.isCurrentlySpeaking = false;
        this.currentAudio = null;
        resolve();
      };
      
      this.currentAudio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        this.isCurrentlySpeaking = false;
        this.currentAudio = null;
        reject(new Error('Audio playback failed'));
      };

      this.currentAudio.onpause = () => {
        URL.revokeObjectURL(audioUrl);
        this.isCurrentlySpeaking = false;
        this.currentAudio = null;
        resolve();
      };
      
      // Check one more time before playing
      if (this.shouldStop) {
        URL.revokeObjectURL(audioUrl);
        this.isCurrentlySpeaking = false;
        this.currentAudio = null;
        resolve();
        return;
      }
      
      this.currentAudio.play().catch((error) => {
        URL.revokeObjectURL(audioUrl);
        this.isCurrentlySpeaking = false;
        this.currentAudio = null;
        reject(error);
      });
    });
  }

  startListening(
    onTranscript: (transcript: string) => void,
    onListeningState: (isListening: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) {
      const errorMsg = 'Speech recognition not supported in this browser. Please try using Chrome or Edge.';
      onError?.(errorMsg);
      return;
    }

    this.onTranscriptCallback = onTranscript;
    this.onListeningStateCallback = onListeningState;
    this.onErrorCallback = onError || null;
    
    // Stop any current audio before listening
    this.stopCurrentAudio();
    
    // Clear any existing timers and reset transcript
    this.clearSilenceTimer();
    this.accumulatedTranscript = '';
    
    try {
      this.recognition.start();
    } catch (error) {
      const errorMsg = 'Failed to start speech recognition. Please check your microphone permissions.';
      onError?.(errorMsg);
    }
  }

  stopListening() {
    this.clearSilenceTimer();
    
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      // The onend event will handle sending the final transcript
    }
  }

  stopCurrentAudio() {
    // Set the stop flag immediately
    this.shouldStop = true;
    
    // Stop Web Audio API playback
    if (this.audioSource) {
      try {
        this.audioSource.stop();
        this.audioSource.disconnect();
      } catch (error) {
        // Ignore errors when stopping already stopped sources
      }
      this.audioSource = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (error) {
        // Ignore errors
      }
      this.gainNode = null;
    }

    // Stop HTML5 audio playback
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }

    // Immediately update speaking state
    this.isCurrentlySpeaking = false;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  isVoiceSynthesisEnabled(): boolean {
    return !!this.apiKey;
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const voiceService = new VoiceService();