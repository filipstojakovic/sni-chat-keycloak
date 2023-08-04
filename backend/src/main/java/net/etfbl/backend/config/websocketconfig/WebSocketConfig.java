package net.etfbl.backend.config.websocketconfig;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  private final BeforeSocketHandshakeInterceptor beforeSocketHandshakeInterceptor;
  @Value("${app.cors.allowedOrigins}")
  private String[] allowedOrigins;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.setApplicationDestinationPrefixes("/api");
    registry.enableSimpleBroker("/user");
    registry.setUserDestinationPrefix("/user");

  }

  // for new SockJS(".../api/ws")
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/api/ws")  // Register the WebSocket endpoint for clients to connect
      .setAllowedOrigins(allowedOrigins).addInterceptors(beforeSocketHandshakeInterceptor).withSockJS();
  }

  //   @Override
  //   public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
  //     DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
  //     resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
  //     MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
  //     converter.setObjectMapper(new ObjectMapper());
  //     converter.setContentTypeResolver(resolver);
  //     messageConverters.add(converter);
  //     return false;
  //   }

}
