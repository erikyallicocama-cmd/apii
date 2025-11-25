package vallegrande.edu.pe.vg.service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vallegrande.edu.pe.vg.dto.AiRequestDTO;
import vallegrande.edu.pe.vg.dto.AiResponseDTO;
import vallegrande.edu.pe.vg.model.AiRequest;

public interface AiService {
    // Método para procesar prompt (create)
    Mono<AiResponseDTO> processPrompt(AiRequestDTO request);
    
    // Método para continuar conversación
    Mono<AiResponseDTO> continueConversation(String conversationId, AiRequestDTO request);
    
    // Obtener historial completo de una conversación (solo activas)
    Flux<AiRequest> getConversationHistory(String conversationId);
    
    // Obtener historial completo incluyendo inactivas
    Flux<AiRequest> getFullConversationHistory(String conversationId);
    
    // Marcar conversación como inactiva
    Mono<Void> deactivateConversation(String conversationId);
    
    // Eliminar conversación completa (borrado físico)
    Mono<Void> deleteConversation(String conversationId);
    
    // Reactivar conversación
    Mono<Void> reactivateConversation(String conversationId);
    
    // CRUD Operations
    Mono<AiRequest> createRequest(AiRequest aiRequest);
    Mono<AiRequest> findById(Long id);
    Flux<AiRequest> findAll();
    Flux<AiRequest> findAllOrderByCreatedAtDesc();
    Flux<AiRequest> findActiveConversationsOrderByCreatedAtDesc(); // Solo conversaciones activas ordenadas por fecha
    Flux<AiRequest> findActiveConversations();
    Mono<AiRequest> updateRequest(Long id, AiRequest aiRequest);
    Mono<Void> deleteById(Long id);
}