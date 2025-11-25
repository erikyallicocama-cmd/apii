package vallegrande.edu.pe.vg.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("VG AI API")
                        .description("API para gestión de peticiones de IA y generación de imágenes con CRUD completo")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Valle Grande")
                                .email("info@vallegrande.edu.pe")))
                .addServersItem(new Server()
                        .url("http://localhost:8085")
                        .description("Servidor de desarrollo"));
    }
}
