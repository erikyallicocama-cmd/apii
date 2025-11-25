// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// AI Types
export interface AiRequest {
  id?: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AiResponse {
  id: number;
  conversationId: string;
  messageOrder: number;
  prompt: string;
  response: string;
  createdAt: string;
}

export interface AiRequestDTO {
  prompt: string;
  model: string;
}

export interface AiContinueConversationDTO {
  prompt: string;
  model: string;
  conversationId: string;
}

export interface AiResponseDTO {
  response: string;
  conversationId: string;
  messageOrder: number;
  createdAt?: string;
}

// Image Types
export interface ImageRequest {
  id?: string;
  prompt: string;
  style?: string;
  size?: string;
  quality?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageResponse {
  id: string;
  requestId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  style: string;
  size: string;
  createdAt: string;
}

export interface ImageRequestDTO {
  prompt: string;
  style_id: number;
  size: string;
}

export interface ImageResponseDTO {
  imageUrl?: string;
  status?: string;
  rawResponse?: string;
}

// AiImage Type para CRUD operations
export interface AiImage {
  id?: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  style?: string;
  styleId: number;
  size: string;
  status?: string;
  rawResponse?: string;
  createdAt?: string;
  updatedAt?: string;
}

// History Types
export interface HistoryItem {
  id: string;
  type: 'ai' | 'image';
  prompt: string;
  response: string | ImageResponse;
  createdAt: string;
}

// Common Types
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Service Types
export interface ServiceError {
  message: string;
  status: number;
  code?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: ServiceError | null;
}
