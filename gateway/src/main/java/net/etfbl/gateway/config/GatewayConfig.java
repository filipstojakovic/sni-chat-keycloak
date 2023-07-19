package net.etfbl.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

  @Bean
  RouteLocator gateway(RouteLocatorBuilder rlb) {
    return rlb
        .routes()
        .route("default-route", r -> r
            .path("/api/**")
            .uri("http://localhost:8080"))
        .route("default-route_1", r -> r
            .path("/api1/**")
            .filters(f -> f.rewritePath("^/api1", "/api"))
            .uri("http://localhost:8081"))
        .build();
  }

}
