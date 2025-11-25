package vallegrande.edu.pe.vg.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import vallegrande.edu.pe.vg.dto.AiRequestDTO;
import vallegrande.edu.pe.vg.dto.AiResponseDTO;
import vallegrande.edu.pe.vg.exception.ResourceNotFoundException;
import vallegrande.edu.pe.vg.service.AiService;
import vallegrande.edu.pe.vg.model.AiRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    // Método original para generar respuesta con IA
    @PostMapping("/generate")
    public Mono<AiResponseDTO> generate(@RequestBody AiRequestDTO request) {
        return aiService.processPrompt(request);
    }

    // Continuar una conversación existente
    @PostMapping("/conversation/{conversationId}")
    public Mono<AiResponseDTO> continueConversation(
            @PathVariable String conversationId, 
            @RequestBody AiRequestDTO request) {
        return aiService.continueConversation(conversationId, request);
    }

    // Obtener historial de una conversación (solo activas)
    @GetMapping("/conversation/{conversationId}")
    public Flux<AiRequest> getConversationHistory(@PathVariable String conversationId) {
        return aiService.getConversationHistory(conversationId);
    }

    // Obtener historial completo de una conversación (incluye inactivas)
    @GetMapping("/conversation/{conversationId}/full")
    public Flux<AiRequest> getFullConversationHistory(@PathVariable String conversationId) {
        return aiService.getFullConversationHistory(conversationId);
    }

    // Marcar conversación como inactiva (soft delete)
    @PutMapping("/conversation/{conversationId}/deactivate")
    public Mono<Map<String, Object>> deactivateConversation(@PathVariable String conversationId) {
        return aiService.deactivateConversation(conversationId)
                .then(Mono.just(Map.of(
                    "success", true,
                    "message", "Conversación desactivada exitosamente",
                    "conversationId", conversationId,
                    "timestamp", System.currentTimeMillis()
                )));
    }

    // Reactivar conversación
    @PutMapping("/conversation/{conversationId}/reactivate")
    public Mono<Map<String, Object>> reactivateConversation(@PathVariable String conversationId) {
        return aiService.reactivateConversation(conversationId)
                .then(Mono.just(Map.of(
                    "success", true,
                    "message", "Conversación reactivada exitosamente",
                    "conversationId", conversationId,
                    "timestamp", System.currentTimeMillis()
                )));
    }

    // Eliminar conversación completa (hard delete)
    @DeleteMapping("/conversation/{conversationId}")
    public Mono<Map<String, Object>> deleteConversation(@PathVariable String conversationId) {
        return aiService.deleteConversation(conversationId)
                .then(Mono.just(Map.of(
                    "success", true,
                    "message", "Conversación eliminada exitosamente",
                    "conversationId", conversationId,
                    "timestamp", System.currentTimeMillis()
                )));
    }

    // CRUD Operations
    
    // CREATE - Crear una nueva petición AI manualmente
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<AiRequest> createRequest(@RequestBody AiRequest aiRequest) {
        return aiService.createRequest(aiRequest);
    }

    // READ - Obtener todas las peticiones
    @GetMapping
    public Flux<AiRequest> getAllRequests() {
        return aiService.findAll();
    }

    // READ - Obtener solo conversaciones activas
    @GetMapping("/active")
    public Flux<AiRequest> getActiveConversations() {
        return aiService.findActiveConversations();
    }

    // READ - Obtener historial ordenado por fecha (solo conversaciones activas)
    @GetMapping("/history")
    public Flux<AiRequest> getHistory() {
        return aiService.findActiveConversationsOrderByCreatedAtDesc();
    }

    // READ - Obtener TODAS las conversaciones (incluyendo inactivas) - para administración
    @GetMapping("/history/all")
    public Flux<AiRequest> getAllHistory() {
        return aiService.findAllOrderByCreatedAtDesc();
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public Mono<AiRequest> getById(@PathVariable Long id) {
        return aiService.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiRequest", "id", id)));
    }

    // UPDATE - Actualizar una petición existente
    @PutMapping("/{id}")
    public Mono<AiRequest> updateRequest(@PathVariable Long id, @RequestBody AiRequest aiRequest) {
        return aiService.updateRequest(id, aiRequest)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiRequest", "id", id)));
    }

    // DELETE - Eliminar una petición por ID
    @DeleteMapping("/{id}")
    public Mono<Map<String, Object>> deleteRequest(@PathVariable Long id) {
        return aiService.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiRequest", "id", id)))
                .flatMap(request -> aiService.deleteById(id)
                    .then(Mono.just(Map.of(
                        "success", true,
                        "message", "Petición eliminada exitosamente",
                        "id", id,
                        "timestamp", System.currentTimeMillis()
                    ))));
    }
}
