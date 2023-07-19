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
            .path("/**")
//             .filters(rs -> rs.tokenRelay())
            .uri("http://localhost:8080"))
        .build();
//         .route(rs -> rs
//             .path("/auth")
//             .filters(GatewayFilterSpec::tokenRelay)
//             .uri("http://localhost:8081")) // resource server uri
//         .route("forward_route", r -> r.path("/**")
//             .filters(GatewayFilterSpec::tokenRelay)
//             .uri("http://localhost:8081"))
//         .build();
  }

}
