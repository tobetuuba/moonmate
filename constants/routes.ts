// App Routes
export const routes = {
  // Auth Routes
  auth: {
    login: '/login',
    signup: '/signup',
    verify: '/verify',
  },

  // Main App Routes
  app: {
    home: '/',
    visualMatch: '/visual-match',
    createProfile: '/create-profile',
    birthData: '/birth-data',
  },

  // Tab Routes
  tabs: {
    home: '/(tabs)',
    chat: '/(tabs)/chat',
    profile: '/(tabs)/profile',
  },

  // Chat Routes
  chat: {
    list: '/chats',
    conversation: (chatId: string) => `/chat/${chatId}`,
  },

  // Feature Routes
  features: {
    zodiacMatch: '/zodiac-match',
    testMatch: '/test-match',
    testResult: '/test-result',
    swipe: '/swipe',
  },
} as const;

// Route Parameters
export const routeParams = {
  chatId: 'chatId',
  userId: 'userId',
} as const;

// Navigation Types
export type AppRoute = typeof routes;
export type RouteParams = typeof routeParams; 