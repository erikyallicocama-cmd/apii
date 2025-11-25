package vallegrande.edu.pe.vg.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "image-api")
public class ImageApiProperties {
    private String url;
    private String rapidapiHost;
    private String rapidapiKey;
}
