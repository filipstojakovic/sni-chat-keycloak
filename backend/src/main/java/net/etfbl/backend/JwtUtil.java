package net.etfbl.backend;

import net.etfbl.backend.config.KeycloakRoleConverter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.security.Principal;
import java.util.Map;

public class JwtUtil {

  public static final String FULL_NAME = "name";
  public static final String USERNAME = "preferred_username";
  public static final String FIRST_NAME = "given_name";
  public static final String LAST_NAME = "family_name";

  public static String getUserId(Principal principal) {
    return principal.getName();
  }

  public static Object getClaim(Principal principal, String claimName) {
    return getClaim((JwtAuthenticationToken) principal, claimName);
  }

  public static Object getClaim(JwtAuthenticationToken principal, String claimName) {
    Map<String, Object> map = ((Jwt) principal.getCredentials()).getClaims();
    return map.get(claimName);
  }

  public static Authentication getAuthenticationFromToken(String token, JwtDecoder jwtDecoder) {
    Jwt jwt = jwtDecoder.decode(token);
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
    return converter.convert(jwt);
  }
}
