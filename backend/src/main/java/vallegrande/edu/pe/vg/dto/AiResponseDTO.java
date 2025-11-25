package vallegrande.edu.pe.vg.dto;

import lombok.Data;

@Data
public class AiResponseDTO {
    private String response;
    private String conversationId;
    private Integer messageOrder;

    public AiResponseDTO(String response) {
        this.response = response;
    }
    
    public AiResponseDTO(String response, String conversationId, Integer messageOrder) {
        this.response = response;
        this.conversationId = conversationId;
        this.messageOrder = messageOrder;
    }
}
