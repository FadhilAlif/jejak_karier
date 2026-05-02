/**
 * Mock user data for development — bypasses Supabase Auth.
 * Replace with real auth when Google OAuth is configured.
 */

export const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@jejakkarier.local',
  full_name: 'Developer Lokal',
  avatar_url: null,
} as const

export const MOCK_USER_ID = MOCK_USER.id
