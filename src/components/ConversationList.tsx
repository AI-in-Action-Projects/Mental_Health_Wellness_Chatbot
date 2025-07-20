import React, { useState } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { Conversation, User } from '../types/chat';
import { UserAvatar } from './UserAvatar';
import { NewConversationModal } from './NewConversationModal';
import { StatusIndicator } from './StatusIndicator';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  users: User[];
  onCreateConversation: (title: string, participantIds: string[]) => void;
  currentUserId: string;
  isOnline: boolean;
  aiEnabled: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  searchQuery,
  onSearch,
  users,
  onCreateConversation,
  currentUserId,
  isOnline,
  aiEnabled
}) => {
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) {
      return 'now';
    } else if (hours < 24) {
      return `${Math.floor(hours)}h`;
    } else if (days < 7) {
      return `${Math.floor(days)}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) {
      return 'No messages yet...';
    }
    
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const sender = conversation.participants.find(p => p.id === lastMessage.senderId);
    const senderName = sender?.id === currentUserId ? 'You' : sender?.name?.split(' ')[0];
    
    return `${senderName}: ${lastMessage.content}`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Status Indicator */}
      <StatusIndicator isOnline={isOnline} aiEnabled={aiEnabled} />
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <button
            onClick={() => setShowNewConversationModal(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle size={48} className="mb-4 opacity-50" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar(s) */}
                <div className="flex-shrink-0">
                  {conversation.participants.length === 2 ? (
                    <UserAvatar
                      user={conversation.participants.find(p => p.id !== currentUserId)!}
                      size="md"
                    />
                  ) : (
                    <div className="relative">
                      <UserAvatar
                        user={conversation.participants[1]}
                        size="sm"
                        className="absolute top-0 left-0"
                      />
                      <UserAvatar
                        user={conversation.participants[2] || conversation.participants[0]}
                        size="sm"
                        className="absolute top-2 left-2 ring-2 ring-white"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.updatedAt)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.isTyping.length > 0 
                      ? `${conversation.participants.find(p => p.id === conversation.isTyping[0])?.name?.split(' ')[0]} is typing...`
                      : getLastMessagePreview(conversation)
                    }
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <NewConversationModal
          users={users.filter(u => u.id !== currentUserId)}
          onClose={() => setShowNewConversationModal(false)}
          onCreateConversation={onCreateConversation}
        />
      )}
    </div>
  );
};