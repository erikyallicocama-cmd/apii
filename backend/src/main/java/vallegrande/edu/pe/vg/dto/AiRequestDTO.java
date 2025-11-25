package vallegrande.edu.pe.vg.dto;

import lombok.Data;

@Data
public class AiRequestDTO {
    private String prompt;
    private String model;
    // Para conversaciones continuas (opcional)
    private String conversationId;
}