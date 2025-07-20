import { User, Conversation, Message } from '../types/chat';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Elena Rodriguez',
    avatar: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/2379003/pexels-photo-2379003.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 'user-6',
    name: 'Priya Patel',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online'
  }
];

export const createMockConversations = (): Conversation[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'conv-1',
      title: 'Project Planning',
      participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-2',
          content: 'Hey team! I wanted to discuss our upcoming project timeline.',
          timestamp: new Date(now.getTime() - 10 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-2',
          senderId: 'user-1',
          content: 'Sounds good! I have some ideas about the architecture.',
          timestamp: new Date(now.getTime() - 8 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-3',
          senderId: 'user-3',
          content: 'Perfect timing. I just finished reviewing the requirements.',
          timestamp: new Date(now.getTime() - 5 * 60 * 1000),
          type: 'text'
        }
      ],
      unreadCount: 2,
      isTyping: [],
      createdAt: twoDaysAgo,
      updatedAt: new Date(now.getTime() - 5 * 60 * 1000)
    },
    {
      id: 'conv-2',
      title: 'Design Review',
      participants: [mockUsers[0], mockUsers[3]],
      messages: [
        {
          id: 'msg-4',
          senderId: 'user-4',
          content: 'I love the new design direction! The colors are perfect.',
          timestamp: oneHourAgo,
          type: 'text'
        },
        {
          id: 'msg-5',
          senderId: 'user-1',
          content: 'Thank you! I spent a lot of time on the color palette.',
          timestamp: new Date(oneHourAgo.getTime() + 5 * 60 * 1000),
          type: 'text'
        }
      ],
      unreadCount: 0,
      isTyping: [],
      createdAt: oneDayAgo,
      updatedAt: new Date(oneHourAgo.getTime() + 5 * 60 * 1000)
    },
    {
      id: 'conv-3',
      title: 'Weekly Standup',
      participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[4], mockUsers[5]],
      messages: [
        {
          id: 'msg-6',
          senderId: 'user-5',
          content: 'Good morning everyone! Ready for our standup?',
          timestamp: oneDayAgo,
          type: 'text'
        },
        {
          id: 'msg-7',
          senderId: 'user-6',
          content: 'Yes! I have some updates to share about the testing phase.',
          timestamp: new Date(oneDayAgo.getTime() + 2 * 60 * 1000),
          type: 'text'
        }
      ],
      unreadCount: 1,
      isTyping: [],
      createdAt: twoDaysAgo,
      updatedAt: new Date(oneDayAgo.getTime() + 2 * 60 * 1000)
    }
  ];
};