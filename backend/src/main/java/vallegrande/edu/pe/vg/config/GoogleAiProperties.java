package vallegrande.edu.pe.vg.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "google.ai")
public class GoogleAiProperties {
    private String apiKey;
    private String model;
}
