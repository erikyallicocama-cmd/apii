import { useAsync } from './useAsync';
import { imageService } from '../services/imageService';
import type { ImageRequestDTO, ImageResponseDTO, AiImage } from '../types/api';

export function useImage() {
  const generateImage = useAsync<ImageResponseDTO>();
  const createImage = useAsync<AiImage>();
  const getAllImages = useAsync<AiImage[]>();
  const getImageHistory = useAsync<AiImage[]>();
  const getImageById = useAsync<AiImage>();
  const updateImage = useAsync<AiImage>();
  const deleteImage = useAsync<void>();

  const generate = async (data: ImageRequestDTO) => {
    return await generateImage.execute(() => imageService.generate(data));
  };

  const create = async (data: AiImage) => {
    return await createImage.execute(() => imageService.create(data));
  };

  const getAll = async () => {
    return await getAllImages.execute(() => imageService.getAll());
  };

  const getHistory = async () => {
    return await getImageHistory.execute(() => imageService.getHistory());
  };

  const getById = async (id: string) => {
    return await getImageById.execute(() => imageService.getById(id));
  };

  const update = async (id: string, data: AiImage) => {
    return await updateImage.execute(() => imageService.update(id, data));
  };

  const deleteById = async (id: string) => {
    return await deleteImage.execute(() => imageService.delete(id));
  };

  return {
    generate,
    create,
    getAll,
    getHistory,
    getById,
    update,
    deleteById,
    generateState: generateImage,
    createState: createImage,
    getAllState: getAllImages,
    historyState: getImageHistory,
    getByIdState: getImageById,
    updateState: updateImage,
    deleteState: deleteImage,
  };
}
