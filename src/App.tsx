import { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './components/MessageBubble';
import { VoiceMessageInput } from './components/VoiceMessageInput';
import { Sidebar } from './components/Sidebar';
import { CrisisModal } from './components/CrisisModal';
import { Menu, Heart, Sparkles, Moon, Sun } from 'lucide-react';
import { Message, User } from './types/chat';
import { voiceService } from './services/voiceService';

// API call
const getGeminiResponse = async (message: string) => {
  const response = await fetch("Backend URL", {
  // const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  return data.response || "Sorry, no response.";
};


// Positive quotes to encourage sharing
const positiveQuotes = [
  "Your feelings are valid and deserve to be heard.",
  "Every step forward, no matter how small, is progress.",
  "You are stronger than you know and braver than you feel.",
  "It's okay to not be okay. Healing takes time.",
  "Your story matters, and so do you.",
  "Speaking your truth is an act of courage.",
  "You don't have to carry this alone.",
  "Your vulnerability is your strength.",
  "This moment doesn't define your entire story.",
  "You are worthy of love, care, and understanding.",
  "Your mental health matters as much as your physical health.",
  "It's brave to ask for help when you need it."
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [currentQuote, setCurrentQuote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionContext, setSessionContext] = useState({
    messageCount: 0,
    questionsAsked: 0,
    userConcerns: [] as string[],
    emotionalState: '',
    currentPhase: 'assessment', // assessment, solution, action, follow-up
    solutionStep: 0,
    totalSolutionSteps: 0,
    solutionOffered: false,
    actionPlan: '',
    actionCompleted: false,
    lastActionCheck: null as Date | null,
    waitingForConfirmation: false
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Set random quote on load
  useEffect(() => {
    const randomQuote = positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Initialize user and app on load
  useEffect(() => {
    // Create a default user
    const defaultUser: User = {
      id: `user-${Date.now()}`,
      name: 'Friend',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online'
    };

    setCurrentUser(defaultUser);
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }

    // Initialize chat
    initializeChat();
  }, []);

  // MUCH MORE SPECIFIC crisis detection - only for explicit self-harm language
  const detectCrisisLanguage = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    
    // Only very specific, explicit self-harm phrases
    const explicitSelfHarmPhrases = [
      'kill myself', 'killing myself', 'suicide', 'suicidal', 'end my life', 'ending my life',
      'want to die', 'wanna die', 'wish i was dead', 'wish i were dead',
      'hurt myself', 'hurting myself', 'harm myself', 'harming myself', 
      'self harm', 'self-harm', 'cut myself', 'cutting myself',
      'take my own life', 'taking my own life', 'end it all', 'ending it all',
      'better off dead', 'not worth living', 'no point in living',
      'cant go on', "can't go on", 'cannot go on',
      'overdose on', 'jump off', 'hang myself', 'hanging myself'
    ];

    // Check for explicit phrases
    const hasExplicitPhrase = explicitSelfHarmPhrases.some(phrase => lowerText.includes(phrase));
    
    // Very specific concerning patterns with context
    const concerningPatterns = [
      /\b(want|wanna|going|planning)\s+to\s+(die|kill\s+myself|end\s+my\s+life)\b/i,
      /\b(feel|am|getting)\s+(suicidal|like\s+killing\s+myself)\b/i,
      /\b(thinking\s+about|thoughts\s+of)\s+(suicide|killing\s+myself|ending\s+my\s+life)\b/i,
      /\b(have\s+a\s+plan|planning)\s+to\s+(kill\s+myself|end\s+my\s+life|commit\s+suicide)\b/i
    ];
    
    const hasPattern = concerningPatterns.some(pattern => pattern.test(lowerText));    
    return hasExplicitPhrase || hasPattern;
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme-preference', newTheme ? 'dark' : 'light');
  };

  const initializeChat = async () => {
    const welcomeMessage: Message = {
      id: 'welcome-msg',
      senderId: 'wellness-ai',
      content: "Hi. I'm here to listen. What's bothering you?",
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([welcomeMessage]);

    // Only speak if voice mode is enabled AND voice synthesis is available
    if (inputMode === 'voice' && voiceService.isVoiceSynthesisEnabled()) {
      try {
        setIsAISpeaking(true);
        await voiceService.synthesizeSpeech(welcomeMessage.content);
      } catch (error) {
      } finally {
        setIsAISpeaking(false);
      }
    }
  };

  const handleRestart = () => {
    voiceService.stopCurrentAudio();
    voiceService.stopListening();
    setMessages([]);
    setIsAISpeaking(false);
    setInputMode('voice');
    setSessionContext({
      messageCount: 0,
      questionsAsked: 0,
      userConcerns: [],
      emotionalState: '',
      currentPhase: 'assessment',
      solutionStep: 0,
      totalSolutionSteps: 0,
      solutionOffered: false,
      actionPlan: '',
      actionCompleted: false,
      lastActionCheck: null,
      waitingForConfirmation: false
    });
    initializeChat();
  };

  const generateAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    // Check for crisis language with improved detection
    const crisisDetected = detectCrisisLanguage(userMessage);
    if (crisisDetected) {
      setShowCrisisModal(true);
    }

    try {
      // Check if Gemini API key is available
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Update session context
      const newContext = {
        ...sessionContext,
        messageCount: sessionContext.messageCount + 1
      };

      // Determine current phase and approach
      let currentPhase = sessionContext.currentPhase;
      let questionsAsked = sessionContext.questionsAsked;
      let solutionStep = sessionContext.solutionStep;
      let waitingForConfirmation = sessionContext.waitingForConfirmation;

      // Phase transitions
      if (currentPhase === 'assessment' && questionsAsked >= 3 && questionsAsked <= 6) {
        currentPhase = 'solution';
        solutionStep = 1;
      } else if (currentPhase === 'solution' && sessionContext.solutionOffered && sessionContext.solutionStep >= sessionContext.totalSolutionSteps) {
        currentPhase = 'action';
      } else if (currentPhase === 'action' && sessionContext.actionPlan) {
        currentPhase = 'follow-up';
      }

      let systemPrompt = '';
      const crisisPrefix = crisisDetected ? 
        `CRITICAL: User expressed concerning language. Gently encourage professional help while being supportive. ` : '';

      switch (currentPhase) {
        case 'assessment':
          questionsAsked += 1;
          systemPrompt = `${crisisPrefix}You are a therapist in ASSESSMENT phase. 

CRITICAL: Keep responses SHORT (1-2 sentences max).
- Ask ONE simple question to understand better
- Be warm but brief
- Don't offer solutions yet
- After 3-6 questions, move to solutions
- NEVER use asterisks or special formatting - this will be spoken aloud

Ask about: triggers, duration, daily impact, what they've tried, when it's better/worse.`;
          break;

        case 'solution':
          if (solutionStep === 1) {
            systemPrompt = `${crisisPrefix}You are offering SOLUTIONS step by step.

CRITICAL: Keep responses SHORT (1-2 sentences max).
- Introduce that you'll share an approach
- Give the FIRST technique briefly
- End with "Make sense?" or "Following me?"
- Don't give all solutions at once
- NEVER use asterisks or special formatting - this will be spoken aloud`;
            waitingForConfirmation = true;
          } else if (solutionStep > 1 && solutionStep <= 2) {
            systemPrompt = `${crisisPrefix}Continue offering solutions step by step.

CRITICAL: Keep responses SHORT (1-2 sentences max).
- This is step ${solutionStep} of your approach
- Explain the NEXT part briefly
- End with "Ready for the next part?"
- NEVER use asterisks or special formatting - this will be spoken aloud`;
            waitingForConfirmation = true;
          } else {
            systemPrompt = `${crisisPrefix}Finish solution and move to ACTION.

CRITICAL: Keep responses SHORT (1-2 sentences max).
- Summarize briefly
- Ask which part feels most doable
- Transition to creating action plan
- NEVER use asterisks or special formatting - this will be spoken aloud`;
            currentPhase = 'action';
          }
          break;

        case 'action':
          systemPrompt = `${crisisPrefix}Create a SPECIFIC ACTION PLAN.

CRITICAL: Keep responses SHORT (1-2 sentences max).
- Give ONE specific step they can try today
- Make it simple and measurable
- Ask "Can you try this for 3 days?"
- NEVER use asterisks or special formatting - this will be spoken aloud`;
          break;

        case 'follow-up':
          systemPrompt = `${crisisPrefix}Check on progress.

CRITICAL: Keep responses SHORT (1-2 sentences max).
- Ask specifically about their action plan
- If they tried it, ask how it went
- If not, gently encourage and problem-solve
- NEVER use asterisks or special formatting - this will be spoken aloud`;
          break;
      }

      const recentMessages = messages
        .slice(-4)
        .map(msg => `${msg.senderId === currentUser?.id ? 'Client' : 'Therapist'}: ${msg.content}`)
        .join('\n');

      const prompt = `${systemPrompt}

Recent conversation:
${recentMessages}

Client: "${userMessage}"

Respond as a caring therapist - SHORT, warm, natural. 1-2 sentences max. This will be spoken aloud so use natural speech without any asterisks, bold text, or special formatting.`;

      let aiResponse = await getGeminiResponse(prompt);

      // Clean up any asterisks or special formatting that might slip through
      aiResponse = aiResponse.replace(/\*/g, '').replace(/\*\*/g, '').trim();
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'wellness-ai',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Only speak if voice mode is enabled AND voice synthesis is available
      if (inputMode === 'voice' && voiceService.isVoiceSynthesisEnabled()) {
        try {
          setIsAISpeaking(true);
          await voiceService.synthesizeSpeech(aiResponse);
        } catch (error) {
        } finally {
          setIsAISpeaking(false);
        }
      }
      
      // Update session context
      let updatedSolutionStep = solutionStep;
      let updatedWaitingForConfirmation = waitingForConfirmation;
      
      if (waitingForConfirmation && currentPhase === 'solution') {
        const userResponseLower = userMessage.toLowerCase();
        const positiveResponses = ['yes', 'yeah', 'ok', 'okay', 'sure', 'makes sense', 'understand', 'got it', 'clear', 'right', 'correct', 'good', 'sounds good'];
        
        if (positiveResponses.some(phrase => userResponseLower.includes(phrase))) {
          updatedSolutionStep = solutionStep + 1;
          updatedWaitingForConfirmation = false;
        }
      }

      const updatedContext = {
        ...newContext,
        questionsAsked,
        currentPhase,
        solutionStep: updatedSolutionStep,
        totalSolutionSteps: 2,
        waitingForConfirmation: updatedWaitingForConfirmation,
        solutionOffered: currentPhase === 'solution' || sessionContext.solutionOffered,
        actionPlan: currentPhase === 'action' ? aiResponse : sessionContext.actionPlan,
        lastActionCheck: currentPhase === 'follow-up' ? new Date() : sessionContext.lastActionCheck
      };

      setSessionContext(updatedContext);

    } catch (error) {
      
      const fallbackResponses = [
        "I'm having trouble connecting. Can you tell me more?",
        "Sorry, lost you there. What's most important right now?",
        "Connection issue. What do you need me to know?"
      ];

      const fallbackMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'wellness-ai',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);

      // Only speak fallback if voice mode is enabled
      if (inputMode === 'voice' && voiceService.isVoiceSynthesisEnabled()) {
        try {
          setIsAISpeaking(true);
          await voiceService.synthesizeSpeech(fallbackMessage.content);
        } catch (error) {
        } finally {
          setIsAISpeaking(false);
        }
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !content.trim()) {
      return;
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: content.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response with a small delay
    setTimeout(() => {
      generateAIResponse(content.trim());
    }, 500);
  };

  const handleStopSpeaking = () => {
    voiceService.stopCurrentAudio();
    setIsAISpeaking(false);
  };

  const handleInputModeChange = (mode: 'voice' | 'text') => {
    setInputMode(mode);
    
    if (mode === 'text') {
      voiceService.stopCurrentAudio();
      voiceService.stopListening();
      setIsAISpeaking(false);
    }
  };

  return (
    <div className={`h-screen flex relative overflow-hidden transition-all duration-1000 ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-orange-50'
    }`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${
            isDarkMode ? 'rgba(242, 141, 0, 0.1)' : 'rgba(242, 171, 0, 0.1)'
          } 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating elements */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              isDarkMode ? 'bg-orange-400/20' : 'bg-orange-300/30'
            } rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Theme Toggle - Main App */}
      <div className="absolute top-4 right-16 sm:right-20 z-30">
        <button
          onClick={toggleTheme}
          className={`p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-white/10 text-yellow-300 hover:bg-white/20' 
              : 'bg-white/70 text-orange-600 hover:bg-white/90'
          } shadow-lg hover:shadow-xl transform hover:scale-110`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>


      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={handleRestart}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Enhanced Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b backdrop-blur-sm ${
          isDarkMode 
            ? 'border-white/10 bg-slate-900/50' 
            : 'border-gray-100 bg-white/80'
        }`}>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl transition-colors lg:hidden ${
                isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl animate-float ${
                  isDarkMode 
                    ? 'bg-orange-500' 
                    : 'bg-orange-500'
                }`}>
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-orange-300 rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode 
                    ? 'text-orange-300' 
                    : 'text-orange-600'
                }`}>
                  Your Mental Health Matters
                </h1>
                <div className={`text-sm sm:text-base flex items-center space-x-2 ${
                  isDarkMode ? 'text-orange-200' : 'text-gray-600'
                }`}>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">
                      {sessionContext.currentPhase === 'assessment' && `A compassionate companion`}
                      {sessionContext.currentPhase === 'solution' && `Exploring solutions together (Step ${sessionContext.solutionStep}/${sessionContext.totalSolutionSteps})`}
                      {sessionContext.currentPhase === 'action' && 'Creating your action plan'}
                      {sessionContext.currentPhase === 'follow-up' && 'Checking your progress'}
                    </span>
                    <span className="sm:hidden">
                      {sessionContext.currentPhase === 'assessment' && `Companion`}
                      {sessionContext.currentPhase === 'solution' && `Solutions (${sessionContext.solutionStep}/${sessionContext.totalSolutionSteps})`}
                      {sessionContext.currentPhase === 'action' && 'Action Plan'}
                      {sessionContext.currentPhase === 'follow-up' && 'Follow-up'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-md mx-auto">
                <div className="relative mb-8 sm:mb-12">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl sm:rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-float ${
                    isDarkMode 
                      ? 'bg-orange-500' 
                      : 'bg-orange-500'
                  }`}>
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" />
                  </div>
                  <div className={`absolute -inset-3 rounded-full blur-xl animate-pulse ${
                    isDarkMode 
                      ? 'bg-orange-400/20' 
                      : 'bg-orange-400/20'
                  }`}></div>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Welcome to your sanctuary</h3>
                
                {/* Positive Quote in Welcome */}
                <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/70 border border-white/50'
                }`}>
                  <p className={`text-sm sm:text-base italic leading-relaxed ${
                    isDarkMode ? 'text-orange-200' : 'text-orange-700'
                  }`}>
                    "{currentQuote}"
                  </p>
                </div>
                
                <p className={`text-base sm:text-lg leading-relaxed px-4 ${
                  isDarkMode ? 'text-orange-200' : 'text-gray-600'
                }`}>
                  This is your personal space for healing and growth. Share whatever is on your heart - 
                  I'm here to listen with compassion and guide you toward peace.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUser?.id}
                  sender={message.senderId === currentUser?.id ? currentUser : {
                    id: 'wellness-ai',
                    name: 'Your Mental Health Matters',
                    avatar: '',
                    status: 'online'
                  }}
                  showAvatar={true}
                  isDarkMode={isDarkMode}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl animate-float ${
                    isDarkMode 
                      ? 'bg-orange-500' 
                      : 'bg-orange-500'
                  }`}>
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
                  </div>
                  <div className={`rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-6 max-w-xs shadow-xl ${
                    isDarkMode 
                      ? 'bg-slate-800/80 backdrop-blur-sm' 
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <div className="flex space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-orange-400' : 'bg-orange-400'
                      }`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-orange-500' : 'bg-orange-500'
                      }`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-orange-400' : 'bg-orange-400'
                      }`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Compact Voice Message Input */}
        <div className={`border-t backdrop-blur-sm ${
          isDarkMode 
            ? 'border-white/10 bg-slate-900/50' 
            : 'border-gray-100 bg-white/80'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <VoiceMessageInput 
              onSendMessage={handleSendMessage}
              isAISpeaking={isAISpeaking}
              onStopSpeaking={handleStopSpeaking}
              isDarkMode={isDarkMode}
              inputMode={inputMode}
              onInputModeChange={handleInputModeChange}
            />
          </div>
        </div>
      </div>

      {/* Crisis Support Modal */}
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;