package vallegrande.edu.pe.vg.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("ai_images")
public class AiImage {
    @Id
    private Long id;
    
    private String prompt;
    
    @Column("style_id")
    private Integer styleId;
    
    private String size;
    
    @Column("image_url")
    private String imageUrl;
    
    private String status;
    
    @Column("raw_response")
    private String rawResponse;
    
    @Column("created_at")
    private LocalDateTime createdAt;
}
