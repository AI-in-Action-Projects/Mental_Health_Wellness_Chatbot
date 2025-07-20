export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
  conversationId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  currentUserId: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  users: User[];
  searchQuery: string;
}