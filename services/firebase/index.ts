export * from './client';
export { FirebaseUserRepository } from './user.repo';
export { FirebaseSwipeRepository } from './swipe.repo';

// Singletons for app-wide use
import { FirebaseUserRepository } from './user.repo';
import { FirebaseSwipeRepository } from './swipe.repo';

export const userRepo = new FirebaseUserRepository();
export const swipeRepo = new FirebaseSwipeRepository();
