package vallegrande.edu.pe.vg.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vallegrande.edu.pe.vg.dto.AiRequestDTO;
import vallegrande.edu.pe.vg.dto.AiResponseDTO;
import vallegrande.edu.pe.vg.model.AiRequest;
import vallegrande.edu.pe.vg.repository.AiRequestRepository;
import vallegrande.edu.pe.vg.service.AiService;
import vallegrande.edu.pe.vg.config.GoogleAiProperties;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiRequestRepository repository;
    private final GoogleAiProperties properties;
    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
            .defaultHeader("Content-Type", "application/json")
            .build();

    @Override
    public Mono<AiResponseDTO> processPrompt(AiRequestDTO request) {
        // Si no hay conversationId, crear una nueva conversación
        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = UUID.randomUUID().toString();
        }
        
        return processConversationPrompt(request, conversationId, 1);
    }

    @Override
    public Mono<AiResponseDTO> continueConversation(String conversationId, AiRequestDTO request) {
        return repository.findByConversationIdAndStatusOrderByMessageOrderAsc(conversationId, "A")
                .collectList()
                .flatMap(conversationHistory -> {
                    int nextOrder = conversationHistory.size() + 1;
                    
                    // Construir el contexto de la conversación para la API
                    return processConversationPrompt(request, conversationId, nextOrder, conversationHistory);
                });
    }

    @Override
    public Flux<AiRequest> getConversationHistory(String conversationId) {
        return repository.findByConversationIdAndStatusOrderByMessageOrderAsc(conversationId, "A");
    }

    @Override
    public Flux<AiRequest> getFullConversationHistory(String conversationId) {
        return repository.findByConversationIdOrderByMessageOrderAsc(conversationId);
    }

    @Override
    public Mono<Void> deactivateConversation(String conversationId) {
        return repository.findByConversationIdOrderByMessageOrderAsc(conversationId)
                .flatMap(request -> {
                    request.setStatus("I");
                    return repository.save(request);
                })
                .then();
    }

    @Override
    public Mono<Void> deleteConversation(String conversationId) {
        return repository.findByConversationIdOrderByMessageOrderAsc(conversationId)
                .flatMap(repository::delete)
                .then();
    }

    @Override
    public Mono<Void> reactivateConversation(String conversationId) {
        return repository.findByConversationIdOrderByMessageOrderAsc(conversationId)
                .flatMap(request -> {
                    request.setStatus("A");
                    return repository.save(request);
                })
                .then();
    }

    @Override
    public Flux<AiRequest> findActiveConversations() {
        return repository.findByStatusOrderByCreatedAtDesc("A");
    }

    @Override
    public Flux<AiRequest> findActiveConversationsOrderByCreatedAtDesc() {
        return repository.findByStatusOrderByCreatedAtDesc("A");
    }

    private Mono<AiResponseDTO> processConversationPrompt(AiRequestDTO request, String conversationId, int messageOrder) {
        return processConversationPrompt(request, conversationId, messageOrder, null);
    }

    private Mono<AiResponseDTO> processConversationPrompt(AiRequestDTO request, String conversationId, 
                                                         int messageOrder, java.util.List<AiRequest> conversationHistory) {
        // Construir el cuerpo de la petición incluyendo el historial si existe
        Object[] contents;
        
        if (conversationHistory != null && !conversationHistory.isEmpty()) {
            // Incluir todo el historial de la conversación
            java.util.List<Object> contentsList = new java.util.ArrayList<>();
            
            for (AiRequest pastRequest : conversationHistory) {
                // Agregar el prompt del usuario
                contentsList.add(Map.of(
                    "role", "user",
                    "parts", new Object[]{Map.of("text", pastRequest.getPrompt())}
                ));
                
                // Agregar la respuesta del asistente
                contentsList.add(Map.of(
                    "role", "model", 
                    "parts", new Object[]{Map.of("text", pastRequest.getResponse())}
                ));
            }
            
            // Agregar el nuevo prompt
            contentsList.add(Map.of(
                "role", "user",
                "parts", new Object[]{Map.of("text", request.getPrompt())}
            ));
            
            contents = contentsList.toArray();
        } else {
            // Primera petición de la conversación
            contents = new Object[]{
                Map.of(
                    "role", "user",
                    "parts", new Object[]{Map.of("text", request.getPrompt())}
                )
            };
        }

        Map<String, Object> body = Map.of("contents", contents);

        String model = (request.getModel() != null && !request.getModel().isBlank()) ? request.getModel() : properties.getModel();
        return webClient.post()
                .uri("/" + model + ":generateContent?key=" + properties.getApiKey())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    String generatedText = null;
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(response);
                        JsonNode candidates = root.path("candidates");
                        if (candidates.isArray() && candidates.size() > 0) {
                            JsonNode parts = candidates.get(0).path("content").path("parts");
                            if (parts.isArray() && parts.size() > 0) {
                                generatedText = parts.get(0).path("text").asText();
                            }
                        }
                    } catch (Exception e) {
                        generatedText = null;
                    }

                    AiRequest aiRequest = AiRequest.builder()
                            .conversationId(conversationId)
                            .messageOrder(messageOrder)
                            .status("A") // Estado activo por defecto
                            .prompt(request.getPrompt())
                            .response(generatedText != null ? generatedText : response)
                            .createdAt(LocalDateTime.now())
                            .build();

                    return repository.save(aiRequest)
                            .map(saved -> new AiResponseDTO(saved.getResponse(), saved.getConversationId(), saved.getMessageOrder()));
                });
    }

    // CRUD Operations Implementation
    @Override
    public Mono<AiRequest> createRequest(AiRequest aiRequest) {
        if (aiRequest.getCreatedAt() == null) {
            aiRequest.setCreatedAt(LocalDateTime.now());
        }
        if (aiRequest.getConversationId() == null || aiRequest.getConversationId().isBlank()) {
            aiRequest.setConversationId(UUID.randomUUID().toString());
        }
        if (aiRequest.getMessageOrder() == null) {
            aiRequest.setMessageOrder(1);
        }
        if (aiRequest.getStatus() == null || aiRequest.getStatus().isBlank()) {
            aiRequest.setStatus("A"); // A=Activo por defecto
        }
        return repository.save(aiRequest);
    }

    @Override
    public Mono<AiRequest> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Flux<AiRequest> findAll() {
        return repository.findAll();
    }

    @Override
    public Flux<AiRequest> findAllOrderByCreatedAtDesc() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Mono<AiRequest> updateRequest(Long id, AiRequest aiRequest) {
        return repository.findById(id)
                .flatMap(existingRequest -> {
                    existingRequest.setPrompt(aiRequest.getPrompt());
                    existingRequest.setResponse(aiRequest.getResponse());
                    // No actualizar createdAt para mantener el timestamp original
                    return repository.save(existingRequest);
                });
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return repository.deleteById(id);
    }
}
