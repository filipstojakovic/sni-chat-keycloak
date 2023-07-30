package net.etfbl.backend.securityconfig;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

  private final ErrorHandler errorHandler;
  private final MyCorsConfiguration corsConfigurationSource;

  @Bean
  protected SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
//     http.cors(Customizer.withDefaults())
    http.cors(c -> c.configurationSource(corsConfigurationSource))
      .csrf(c -> c.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())) // store csrf token i cookie
      .authorizeHttpRequests(r -> {
          r.requestMatchers("/api/ws/**").permitAll();
          r.requestMatchers("/test/*").permitAll(); //TODO: delete me
          r.anyRequest().authenticated();
        }
      )
      .headers(header -> header.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
      .exceptionHandling(e -> e.authenticationEntryPoint(errorHandler))
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .oauth2ResourceServer(
        httpSecurityOAuth2ResourceServerConfigurer ->
          httpSecurityOAuth2ResourceServerConfigurer.jwt(
            jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(jwtConverter())));

    return http.build();
  }

  private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtConverter() {
    final JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
    return jwtAuthenticationConverter;
  }

}
