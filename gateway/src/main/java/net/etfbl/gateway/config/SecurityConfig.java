package net.etfbl.gateway.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

//   @Bean
//   protected SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
// //     http.cors(Customizer.withDefaults())
//     http.cors(c -> {
//       c.disable();
// //           c.configurationSource(
// //               request -> {
// //                 CorsConfiguration configuration = new CorsConfiguration();
// //                 configuration.setAllowedOrigins(List.of("http://localhost:4200"));
// //                 configuration.setAllowedMethods(List.of(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(), HttpMethod.OPTIONS.name(), HttpMethod.DELETE.name()));
// //                 configuration.setExposedHeaders(List.of(CorsConfiguration.ALL));
// //                 configuration.setAllowCredentials(true);
// //                 configuration.setMaxAge(5600L);
// //                 return configuration;
// //               });
//         })
//         .csrf(AbstractHttpConfigurer::disable);
// //         .authorizeHttpRequests(r -> r.anyRequest().authenticated())
// //         .exceptionHandling(e -> e.authenticationEntryPoint(errorHandler))
// //         .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// //         .oauth2ResourceServer(
// //             httpSecurityOAuth2ResourceServerConfigurer ->
// //                 httpSecurityOAuth2ResourceServerConfigurer.jwt(
// //                     jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(jwtConverter())));
//
//     return http.build();
//   }

}
