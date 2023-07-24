package net.etfbl.backend;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class BeforeSocketHandshakeInterceptor implements HandshakeInterceptor {

  public static final String TOKEN_FIELD_NAME = "token";
  private final JwtDecoder jwtDecoder;

  @Override
  public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

    String queryString = request.getURI().getQuery();
    if (queryString == null) {
      return false;
    }

    String[] queryList = queryString.split("=");
    if (!hasOnlyTokenInQuery(queryList)) {
      return false;
    }

    String token = queryList[1];
    Authentication authentication = JwtUtil.getAuthenticationFromToken(token, jwtDecoder);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    return true;
  }

  @Override
  public void afterHandshake(final ServerHttpRequest request,
                             final ServerHttpResponse response,
                             final WebSocketHandler wsHandler,
                             final Exception exception) {
    // nothing to see here
  }

  private boolean hasOnlyTokenInQuery(String[] queryList) {
    return queryList.length == 2
        && TOKEN_FIELD_NAME.equals(queryList[0])
        && !queryList[1].isEmpty();
  }
}
