package vallegrande.edu.pe.vg.service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vallegrande.edu.pe.vg.dto.ImageRequestDTO;
import vallegrande.edu.pe.vg.dto.ImageResponseDTO;
import vallegrande.edu.pe.vg.model.AiImage;

public interface ImageService {
    // Método para generar imagen (create)
    Mono<ImageResponseDTO> generateImage(ImageRequestDTO request);
    
    // CRUD Operations
    Mono<AiImage> createImage(AiImage aiImage);
    Mono<AiImage> findById(Long id);
    Flux<AiImage> findAll();
    Flux<AiImage> findAllOrderByCreatedAtDesc();
    Mono<AiImage> updateImage(Long id, AiImage aiImage);
    Mono<Void> deleteById(Long id);
    
    // Métodos para activar/desactivar
    Mono<Void> deactivateImage(Long id);
    Mono<Void> reactivateImage(Long id);
    Flux<AiImage> findActiveImages();
    Flux<AiImage> findAllImagesOrderByCreatedAtDesc();
}
