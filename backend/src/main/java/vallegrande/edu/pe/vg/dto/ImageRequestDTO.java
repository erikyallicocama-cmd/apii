package vallegrande.edu.pe.vg.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ImageRequestDTO {
    private String prompt;
    
    @JsonProperty("style_id")
    private Integer styleId;
    
    private String size;
}
