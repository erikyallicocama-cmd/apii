package vallegrande.edu.pe.vg.controller;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import vallegrande.edu.pe.vg.dto.ImageRequestDTO;
import vallegrande.edu.pe.vg.dto.ImageResponseDTO;
import vallegrande.edu.pe.vg.exception.ResourceNotFoundException;
import vallegrande.edu.pe.vg.model.AiImage;
import vallegrande.edu.pe.vg.service.ImageService;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImageController {
    private final ImageService imageService;

    // Método original para generar imagen con IA
    @PostMapping("/generate")
    public Mono<ImageResponseDTO> generate(@RequestBody ImageRequestDTO request) {
        return imageService.generateImage(request);
    }

    // CRUD Operations

    // CREATE - Crear una nueva imagen AI manualmente
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<AiImage> createImage(@RequestBody AiImage aiImage) {
        return imageService.createImage(aiImage);
    }

    // READ - Obtener todas las imágenes
    @GetMapping
    public Flux<AiImage> getAllImages() {
        return imageService.findAll();
    }

    // READ - Obtener historial ordenado por fecha (solo activas)
    @GetMapping("/history")
    public Flux<AiImage> getHistory() {
        return imageService.findActiveImages();
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public Mono<AiImage> getById(@PathVariable Long id) {
        return imageService.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiImage", "id", id)));
    }

    // UPDATE - Actualizar una imagen existente
    @PutMapping("/{id}")
    public Mono<AiImage> updateImage(@PathVariable Long id, @RequestBody AiImage aiImage) {
        return imageService.updateImage(id, aiImage)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiImage", "id", id)));
    }

    // DELETE - Eliminar una imagen por ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK) // Puedes cambiarlo a 200 OK
    public Mono<Map<String, Object>> deleteImage(@PathVariable Long id) {
        return imageService.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("AiImage", "id", id)))
                .then(imageService.deleteById(id))
                .then(Mono.just(Map.of(
                        "success", true,
                        "message", "Imagen eliminada exitosamente",
                        "id", id,
                        "timestamp", System.currentTimeMillis())));
    }

    // Desactivar imagen (soft delete)
    @PutMapping("/{id}/deactivate")
    public Mono<Map<String, Object>> deactivateImage(@PathVariable Long id) {
        return imageService.deactivateImage(id)
                .then(Mono.just(Map.of(
                    "success", true,
                    "message", "Imagen desactivada exitosamente",
                    "id", id,
                    "timestamp", System.currentTimeMillis()
                )));
    }

    // Reactivar imagen
    @PutMapping("/{id}/reactivate")
    public Mono<Map<String, Object>> reactivateImage(@PathVariable Long id) {
        return imageService.reactivateImage(id)
                .then(Mono.just(Map.of(
                    "success", true,
                    "message", "Imagen reactivada exitosamente",
                    "id", id,
                    "timestamp", System.currentTimeMillis()
                )));
    }

    // READ - Obtener solo imágenes activas
    @GetMapping("/active")
    public Flux<AiImage> getActiveImages() {
        return imageService.findActiveImages();
    }

    // READ - Obtener TODAS las imágenes (incluyendo inactivas) - para administración
    @GetMapping("/history/all")
    public Flux<AiImage> getAllHistory() {
        return imageService.findAllImagesOrderByCreatedAtDesc();
    }
}
