import { apiClient } from './apiClient';
import type {
  AiRequest,
  AiResponse,
  AiRequestDTO,
  AiContinueConversationDTO,
  AiResponseDTO,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

export class AiService {
  private readonly basePath = '/ai';

 async getAll(active: boolean): Promise<PaginatedResponse<AiRequest>> {
  // Parámetro de filtro 'active' para obtener solo las conversaciones activas
  const queryParams = new URLSearchParams();
  queryParams.append('active', active.toString());  // Solo pasamos el filtro de "active"

  const query = queryParams.toString();
  
  // URL simplificada con solo el parámetro 'active'
  return apiClient.get<PaginatedResponse<AiRequest>>(`${this.basePath}/active${query ? `?${query}` : ''}`);
}


  // Get AI request by ID
  async getById(id: string): Promise<AiRequest> {
    return apiClient.get<AiRequest>(`${this.basePath}/${id}`);
  }

  // Create new AI request
  async create(data: AiRequestDTO): Promise<AiRequest> {
    console.log('Creating AI request with data:', data);
    return apiClient.post<AiRequest>(this.basePath, data);
  }

  // Update AI request
  async update(id: string, data: Partial<AiRequestDTO>): Promise<AiRequest> {
    return apiClient.put<AiRequest>(`${this.basePath}/${id}`, data);
  }

  // Delete AI request
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Generate AI response (Iniciar nueva conversación)
  async generate(data: AiRequestDTO): Promise<AiResponseDTO> {
    return apiClient.post<AiResponseDTO>(`${this.basePath}/generate`, data);
  }

  // Continuar conversación existente
  async continueConversation(conversationId: string, data: AiContinueConversationDTO): Promise<AiResponseDTO> {
    return apiClient.post<AiResponseDTO>(`${this.basePath}/conversation/${conversationId}`, data);
  }

  // Obtener historial de una conversación específica
  async getConversation(conversationId: string): Promise<AiResponse[]> {
    return apiClient.get<AiResponse[]>(`${this.basePath}/conversation/${conversationId}`);
  }

  // Get AI history
  async getHistory(params?: PaginationParams): Promise<AiResponse[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    console.log('historial de consultas:', params);
    return apiClient.get<AiResponse[]>(`${this.basePath}/history${query ? `?${query}` : ''}`);
  }

  // Eliminar conversación completa
  async deleteConversation(conversationId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/conversation/${conversationId}`);
  }

  // Desactivar conversación
  async deactivateConversation(conversationId: string): Promise<void> {
    return apiClient.put<void>(`${this.basePath}/conversation/${conversationId}/deactivate`);
  }

  // Reactivar conversación
  async reactivateConversation(conversationId: string): Promise<void> {
    return apiClient.put<void>(`${this.basePath}/conversation/${conversationId}/reactivate`);
  }

  // Get all history including inactive conversations (para ver archivadas)
  async getAllHistory(params?: PaginationParams): Promise<AiResponse[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    return apiClient.get<AiResponse[]>(`${this.basePath}/history/all${query ? `?${query}` : ''}`);
  }
}

export const aiService = new AiService();
