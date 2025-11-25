package vallegrande.edu.pe.vg.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vallegrande.edu.pe.vg.config.ImageApiProperties;
import vallegrande.edu.pe.vg.dto.ImageRequestDTO;
import vallegrande.edu.pe.vg.dto.ImageResponseDTO;
import vallegrande.edu.pe.vg.service.ImageService;
import vallegrande.edu.pe.vg.model.AiImage;
import vallegrande.edu.pe.vg.repository.AiImageRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageApiProperties properties;
    private final AiImageRepository aiImageRepository;
    private final WebClient webClient = WebClient.builder().build();

    @Override
    public Mono<ImageResponseDTO> generateImage(ImageRequestDTO request) {
        // Construir el body como JSON
        String jsonBody = buildJsonBody(request);

        return webClient.post()
                .uri(properties.getUrl())
                .header("Content-Type", "application/json")
                .header("x-rapidapi-host", properties.getRapidapiHost())
                .header("x-rapidapi-key", properties.getRapidapiKey())
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    ImageResponseDTO dto = new ImageResponseDTO();
                    
                    // Sanitizar el response removiendo bytes nulos y caracteres inválidos
                    String sanitizedResponse = sanitizeString(response);
                    dto.setRawResponse(sanitizedResponse);
                    
                    String imageUrl = null;
                    String status = "success";
                    
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(sanitizedResponse);
                        
                        // Extraer la URL de la imagen de la estructura:
                        // {"code":200,"message":"Success","result":{"data":{"results":[{"origin":"URL"}]}}}
                        
                        // 1. Intentar extraer de result.data.results[0].origin (estructura nueva)
                        JsonNode resultsNode = root.path("result").path("data").path("results");
                        if (resultsNode.isArray() && resultsNode.size() > 0) {
                            JsonNode firstResult = resultsNode.get(0);
                            JsonNode originNode = firstResult.path("origin");
                            if (!originNode.isMissingNode()) {
                                imageUrl = originNode.asText();
                                dto.setImageUrl(imageUrl);
                                dto.setStatus(status);
                            } else {
                                status = "error";
                                dto.setStatus(status);
                            }
                        } 
                        // 2. Fallback: Intentar extraer de image_url (estructura antigua)
                        else {
                            JsonNode imageUrlNode = root.path("image_url");
                            if (!imageUrlNode.isMissingNode()) {
                                imageUrl = imageUrlNode.asText();
                                dto.setImageUrl(imageUrl);
                                dto.setStatus(status);
                            } else {
                                // 3. Fallback: Intentar extraer de url
                                JsonNode urlNode = root.path("url");
                                if (!urlNode.isMissingNode()) {
                                    imageUrl = urlNode.asText();
                                    dto.setImageUrl(imageUrl);
                                    dto.setStatus(status);
                                } else {
                                    status = "error";
                                    dto.setStatus(status);
                                }
                            }
                        }
                    } catch (Exception e) {
                        status = "error";
                        dto.setStatus(status);
                    }
                    
                    // Sanitizar también la imageUrl si existe
                    String sanitizedImageUrl = imageUrl != null ? sanitizeString(imageUrl) : null;
                    
                    // Guardar en la base de datos con estado "A" (activo)
                    AiImage aiImage = AiImage.builder()
                            .prompt(sanitizeString(request.getPrompt()))
                            .styleId(request.getStyleId())
                            .size(request.getSize())
                            .imageUrl(sanitizedImageUrl)
                            .status("A") // Estado activo por defecto
                            .rawResponse(sanitizedResponse)
                            .createdAt(java.time.LocalDateTime.now())
                            .build();
                    
                    return aiImageRepository.save(aiImage).thenReturn(dto);
                });
    }

    /**
     * Construye el body JSON para la API de generación de imágenes
     * Formato: {"prompt": "...", "style_id": 4, "size": "1-1"}
     */
    private String buildJsonBody(ImageRequestDTO request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            
            // Crear un Map con la estructura exacta que requiere la API
            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("prompt", request.getPrompt());
            body.put("style_id", request.getStyleId());
            body.put("size", request.getSize() != null ? request.getSize() : "1-1");
            
            return mapper.writeValueAsString(body);
        } catch (Exception e) {
            // Fallback: construir JSON manualmente si hay error
            return String.format("{\"prompt\":\"%s\",\"style_id\":%d,\"size\":\"%s\"}", 
                    request.getPrompt().replace("\"", "\\\""), 
                    request.getStyleId(), 
                    request.getSize() != null ? request.getSize() : "1-1");
        }
    }

    /**
     * Sanitiza una cadena removiendo bytes nulos (0x00) y caracteres no imprimibles
     * que pueden causar problemas con PostgreSQL UTF-8
     */
    private String sanitizeString(String input) {
        if (input == null) {
            return null;
        }
        
        // Remover bytes nulos (0x00) y otros caracteres de control problemáticos
        // Mantener solo caracteres imprimibles y espacios en blanco comunes
        return input.replaceAll("\\x00", "")           // Remover NULL bytes
                    .replaceAll("[\\x01-\\x08]", "")   // Remover caracteres de control
                    .replaceAll("[\\x0B-\\x0C]", "")   // Remover VT y FF
                    .replaceAll("[\\x0E-\\x1F]", "")   // Remover otros controles
                    .replaceAll("\\p{C}", "");         // Remover caracteres de control Unicode
    }

    // CRUD Operations Implementation
    @Override
    public Mono<AiImage> createImage(AiImage aiImage) {
        if (aiImage.getCreatedAt() == null) {
            aiImage.setCreatedAt(LocalDateTime.now());
        }
        return aiImageRepository.save(aiImage);
    }

    @Override
    public Mono<AiImage> findById(Long id) {
        return aiImageRepository.findById(id);
    }

    @Override
    public Flux<AiImage> findAll() {
        return aiImageRepository.findAll();
    }

    @Override
    public Flux<AiImage> findAllOrderByCreatedAtDesc() {
        return aiImageRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Mono<AiImage> updateImage(Long id, AiImage aiImage) {
        return aiImageRepository.findById(id)
                .flatMap(existingImage -> {
                    existingImage.setPrompt(aiImage.getPrompt());
                    existingImage.setStyleId(aiImage.getStyleId());
                    existingImage.setSize(aiImage.getSize());
                    existingImage.setImageUrl(aiImage.getImageUrl());
                    existingImage.setStatus(aiImage.getStatus());
                    existingImage.setRawResponse(aiImage.getRawResponse());
                    // No actualizar createdAt para mantener el timestamp original
                    return aiImageRepository.save(existingImage);
                });
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return aiImageRepository.deleteById(id);
    }

    // Métodos para activar/desactivar
    @Override
    public Mono<Void> deactivateImage(Long id) {
        return aiImageRepository.findById(id)
                .flatMap(image -> {
                    image.setStatus("I"); // Inactivo
                    return aiImageRepository.save(image);
                })
                .then();
    }

    @Override
    public Mono<Void> reactivateImage(Long id) {
        return aiImageRepository.findById(id)
                .flatMap(image -> {
                    image.setStatus("A"); // Activo
                    return aiImageRepository.save(image);
                })
                .then();
    }

    @Override
    public Flux<AiImage> findActiveImages() {
        return aiImageRepository.findByStatusOrderByCreatedAtDesc("A");
    }

    @Override
    public Flux<AiImage> findAllImagesOrderByCreatedAtDesc() {
        return aiImageRepository.findAllByOrderByCreatedAtDesc();
    }
}
