package vallegrande.edu.pe.vg.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vallegrande.edu.pe.vg.dto.AiRequestDTO;
import vallegrande.edu.pe.vg.dto.AiResponseDTO;

import java.util.UUID;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {

    // Endpoint de prueba que siempre funciona (para debugging frontend)
    @PostMapping("/ai/generate")
    public Mono<AiResponseDTO> testGenerate(@RequestBody AiRequestDTO request) {
        String conversationId = UUID.randomUUID().toString();
        String response = "Esta es una respuesta de prueba para el prompt: '" + request.getPrompt() + "'. " +
                         "El sistema está funcionando correctamente. Timestamp: " + System.currentTimeMillis();
        
        return Mono.just(new AiResponseDTO(response, conversationId, 1));
    }

    // Endpoint para probar CORS
    @GetMapping("/cors")
    public Mono<String> testCors() {
        return Mono.just("{\"message\":\"CORS is working\",\"timestamp\":\"" + System.currentTimeMillis() + "\"}");
    }

    // Endpoint para probar conectividad básica
    @GetMapping("/ping")
    public Mono<String> ping() {
        return Mono.just("{\"status\":\"OK\",\"message\":\"Server is running\"}");
    }

    // Endpoint que simula error para probar manejo de errores
    @PostMapping("/error")
    public Mono<AiResponseDTO> testError() {
        return Mono.error(new RuntimeException("Error de prueba para testing"));
    }
}
