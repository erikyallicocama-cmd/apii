package vallegrande.edu.pe.vg.model;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("ai_requests")
public class AiRequest {

    @Id
    private Long id;

    // Identificador de la conversación/sesión
    @Column("conversation_id")
    private String conversationId;
    
    // Orden del mensaje en la conversación
    @Column("message_order")
    private Integer messageOrder;
    
    // Estado de la conversación: A=Activo, I=Inactivo, D=Eliminado
    private String status;
    
    private String prompt;
    private String response;
    
    @Column("created_at")
    private LocalDateTime createdAt;
}
