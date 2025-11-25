import { useAsync } from './useAsync';
import { aiService } from '../services/aiService';
import type { AiRequestDTO, AiResponseDTO, AiRequest, PaginationParams } from '../types/api';

export function useAi() {
  const generateAi = useAsync<AiResponseDTO>();
  const createAiRequest = useAsync<AiRequest>();
  const getAllAiRequests = useAsync<any>();
  const getAiHistory = useAsync<any>();

  const generate = async (data: AiRequestDTO) => {
    return await generateAi.execute(() => aiService.generate(data));
  };

  const create = async (data: AiRequestDTO) => {
    return await createAiRequest.execute(() => aiService.create(data));
  };

  const getAll = async (active: boolean = true) => {
    return await getAllAiRequests.execute(() => aiService.getAll(active));
  };

  const getHistory = async (params?: PaginationParams) => {
    return await getAiHistory.execute(() => aiService.getHistory(params));
  };

  return {
    generate,
    create,
    getAll,
    getHistory,
    generateState: generateAi,
    createState: createAiRequest,
    getAllState: getAllAiRequests,
    historyState: getAiHistory,
  };
}
