import { apiClient } from './apiClient';
import type {
  AiImage,
  ImageRequestDTO,
  ImageResponseDTO,
} from '../types/api';

export class ImageService {
  private readonly basePath = '/image';

  // Generate new image using AI
  async generate(data: ImageRequestDTO): Promise<ImageResponseDTO> {
    console.log('Generating image with data:', data);
    return apiClient.post<ImageResponseDTO>(`${this.basePath}/generate`, data);
  }

  // Get all images
  async getAll(): Promise<AiImage[]> {
    return apiClient.get<AiImage[]>(this.basePath);
  }

  // Get image history ordered by creation date
  async getHistory(): Promise<AiImage[]> {
    console.log('Obteniendo historial de imágenes');
    return apiClient.get<AiImage[]>(`${this.basePath}/history`);
  }

  // Get image by ID
  async getById(id: string): Promise<AiImage> {
    return apiClient.get<AiImage>(`${this.basePath}/${id}`);
  }

  // Create new AI image manually
  async create(data: AiImage): Promise<AiImage> {
    console.log('Creating AI image with data:', data);
    return apiClient.post<AiImage>(this.basePath, data);
  }

  // Update existing image
  async update(id: string, data: AiImage): Promise<AiImage> {
    return apiClient.put<AiImage>(`${this.basePath}/${id}`, data);
  }

  // Delete image by ID
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Desactivar imagen
  async deactivateImage(id: string): Promise<void> {
    return apiClient.put<void>(`${this.basePath}/${id}/deactivate`);
  }

  // Reactivar imagen
  async reactivateImage(id: string): Promise<void> {
    return apiClient.put<void>(`${this.basePath}/${id}/reactivate`);
  }

  // Get active images only
  async getActiveImages(): Promise<AiImage[]> {
    return apiClient.get<AiImage[]>(`${this.basePath}/active`);
  }

  // Get all images including inactive
  async getAllImagesHistory(): Promise<AiImage[]> {
    return apiClient.get<AiImage[]>(`${this.basePath}/history/all`);
  }
}

export const imageService = new ImageService();
