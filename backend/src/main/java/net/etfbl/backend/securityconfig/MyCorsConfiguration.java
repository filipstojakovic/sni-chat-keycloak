package net.etfbl.backend.securityconfig;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@RequiredArgsConstructor
@Configuration
public class MyCorsConfiguration implements CorsConfigurationSource {

  public static final long MAX_AGE = 5600L;
  @Value("${app.cors.allowedOrigins}")
  private String[] allowedOrigins;

  @Override
  public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(allowedOrigins));
    configuration.setAllowedMethods(List.of(CorsConfiguration.ALL));
    configuration.setExposedHeaders(List.of(CorsConfiguration.ALL));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(MAX_AGE);
    return configuration;
  }
}
