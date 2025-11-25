// AI Models disponibles
export const AI_MODELS = {
  GEMINI_PRO: 'gemini-2.5-pro',
  GEMINI_FLASH: 'gemini-2.5-flash',
} as const;

export type AiModel = typeof AI_MODELS[keyof typeof AI_MODELS];

// Lista de modelos para UI
export const AI_MODEL_OPTIONS = [
  {
    value: AI_MODELS.GEMINI_PRO,
    label: 'Gemini 2.5 Pro',
    description: 'Modelo más potente para razonamiento complejo'
  },
  {
    value: AI_MODELS.GEMINI_FLASH,
    label: 'Gemini 2.5 Flash',
    description: 'Modelo balanceado y más rápido'
  }
] as const;
