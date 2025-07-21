// Match-related API operations
import { User } from './UserService';

export interface Match {
  id: string;
  user: User;
  compatibilityScore: number;
  matchedAt: Date;
  lastInteraction?: Date;
  mutualLikes: boolean;
  conversationStarted: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'system';
}

export class MatchService {
  private static baseUrl = 'https://api.moonmate.app'; // Replace with your API URL

  static async getMatches(): Promise<Match[]> {
    // Mock implementation - replace with actual API call
    const mockMatches: Match[] = [
      {
        id: '1',
        user: {
          id: '1',
          name: 'Emma',
          age: 28,
          photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'],
          bio: 'Adventure seeker who loves deep conversations.',
          interests: ['Photography', 'Hiking', 'Astronomy'],
          location: { lat: 40.7589, lng: -73.9851, city: 'New York' },
          preferences: { ageRange: [25, 35], maxDistance: 30, genderPreference: ['all'] },
        },
        compatibilityScore: 95,
        matchedAt: new Date(Date.now() - 86400000), // 1 day ago
        mutualLikes: true,
        conversationStarted: true,
      },
      // Add more mock matches...
    ];

    return Promise.resolve(mockMatches);
  }

  static async likeUser(userId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    // Implementation would record like and check for mutual match
    console.log('Liking user:', userId);
    
    // Mock response
    const isMatch = Math.random() > 0.7; // 30% chance of match
    return Promise.resolve({
      isMatch,
      matchId: isMatch ? `match-${Date.now()}` : undefined,
    });
  }

  static async passUser(userId: string): Promise<void> {
    // Implementation would record pass/skip
    console.log('Passing on user:', userId);
    return Promise.resolve();
  }

  static async getConversation(matchId: string): Promise<Message[]> {
    // Mock implementation
    const mockMessages: Message[] = [
      {
        id: '1',
        matchId,
        senderId: '1',
        content: 'Hi! I loved reading your profile. We seem to have so much in common!',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        type: 'text',
      },
      // Add more mock messages...
    ];

    return Promise.resolve(mockMessages);
  }

  static async sendMessage(matchId: string, content: string): Promise<Message> {
    // Implementation would send message via API
    console.log('Sending message:', { matchId, content });
    
    // Mock response
    const message: Message = {
      id: Date.now().toString(),
      matchId,
      senderId: 'current-user',
      content,
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    return Promise.resolve(message);
  }

  static async markMessagesAsRead(matchId: string): Promise<void> {
    // Implementation would mark messages as read
    console.log('Marking messages as read for match:', matchId);
    return Promise.resolve();
  }

  static async unmatch(matchId: string): Promise<void> {
    // Implementation would remove match
    console.log('Unmatching:', matchId);
    return Promise.resolve();
  }

  static async reportUser(userId: string, reason: string): Promise<void> {
    // Implementation would report user
    console.log('Reporting user:', { userId, reason });
    return Promise.resolve();
  }
}