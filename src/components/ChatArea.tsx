import React, { useEffect, useRef } from 'react';
import { Conversation, User } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { UserAvatar } from './UserAvatar';
import { Phone, Video, Info, MessageCircle } from 'lucide-react';

interface ChatAreaProps {
  conversation: Conversation | undefined;
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  currentUserId,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {otherParticipants.length === 1 ? (
              <UserAvatar user={otherParticipants[0]} size="md" />
            ) : (
              <div className="relative">
                <UserAvatar user={otherParticipants[0]} size="sm" />
                <UserAvatar 
                  user={otherParticipants[1]} 
                  size="sm" 
                  className="absolute -top-1 -right-1 ring-2 ring-white"
                />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {conversation.title}
              </h2>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                {otherParticipants.map((participant, index) => (
                  <span key={participant.id}>
                    {participant.name}
                    {index < otherParticipants.length - 1 && ', '}
                  </span>
                ))}
                {otherParticipants.some(p => p.status === 'online') && (
                  <span className="text-green-500">• online</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Video size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
            <p className="text-gray-500">Send a message to get things started!</p>
          </div>
        ) : (
          <>
            {conversation.messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                sender={conversation.participants.find(p => p.id === message.senderId)}
                showAvatar={
                  index === 0 ||
                  conversation.messages[index - 1].senderId !== message.senderId ||
                  (message.timestamp.getTime() - conversation.messages[index - 1].timestamp.getTime()) > 300000
                }
              />
            ))}
            
            {/* Typing indicator */}
            {conversation.isTyping.length > 0 && (
              <div className="flex items-center space-x-2">
                <UserAvatar
                  user={conversation.participants.find(p => p.id === conversation.isTyping[0])!}
                  size="sm"
                />
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};