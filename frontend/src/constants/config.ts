export const API_ENDPOINTS = {
  AI: {
    BASE: '/api/ai',
    GENERATE: '/api/ai/generate',
    HISTORY: '/api/ai/history',
  },
  IMAGE: {
    BASE: '/api/image',
    GENERATE: '/api/image/generate',
    HISTORY: '/api/image/history',
  },
} as const;

export const APP_CONFIG = {
  NAME: 'AI Assistant',
  VERSION: '1.0.0',
  DEFAULT_API_URL: 'http://localhost:8080',
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;
