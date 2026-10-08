import type { User } from '../../models';
export type SessionState = {
  status: 'loading' | 'guest' | 'authenticated';
  user: User | null;
};
export const guestSession: SessionState = { status: 'guest', user: null };
// UI convenience only. Future protected routes consume session status and this
// helper; the server must independently enforce every authorization decision.
export const hasRole = (user: User | null, role: string) =>
  user?.roles.includes(role) ?? false;
