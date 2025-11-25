package vallegrande.edu.pe.vg.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import vallegrande.edu.pe.vg.model.AiRequest;

@Repository
public interface AiRequestRepository extends ReactiveCrudRepository<AiRequest, Long> {
    Flux<AiRequest> findAllByOrderByCreatedAtDesc();
    
    // Buscar toda la conversación por ID de conversación (solo activas)
    Flux<AiRequest> findByConversationIdAndStatusOrderByMessageOrderAsc(String conversationId, String status);
    
    // Buscar conversación sin filtro de estado
    Flux<AiRequest> findByConversationIdOrderByMessageOrderAsc(String conversationId);
    
    // Buscar la última conversación activa
    Flux<AiRequest> findByConversationIdAndStatusOrderByCreatedAtDesc(String conversationId, String status);
    
    // Buscar solo conversaciones activas
    Flux<AiRequest> findByStatusOrderByCreatedAtDesc(String status);
}

