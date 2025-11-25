package vallegrande.edu.pe.vg.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import vallegrande.edu.pe.vg.model.AiImage;

@Repository
public interface AiImageRepository extends ReactiveCrudRepository<AiImage, Long> {
    Flux<AiImage> findAllByOrderByCreatedAtDesc();
    Flux<AiImage> findByStatus(String status);
    Flux<AiImage> findByStatusOrderByCreatedAtDesc(String status);
}
