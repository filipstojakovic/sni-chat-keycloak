package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.exception.UnAuthorizedException;
import net.etfbl.backend.model.KeyExchangeRequest;
import net.etfbl.backend.model.SocketMessagePart;
import net.etfbl.backend.service.MessageService;
import net.etfbl.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  @Value("${server.port}")
  private int serverPort;

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final MessageService messageService;

  @ResponseBody
  @PostMapping("api/key-exchange")
  public ResponseEntity<Void> keyExchange(@RequestBody KeyExchangeRequest keyExchangeRequest,
                                          JwtAuthenticationToken principal) {

    messageService.exchangeKey(keyExchangeRequest, JwtUtil.getUsername(principal));
    return ResponseEntity.ok().body(null);
  }

  /**
   * <a href="https://docs.spring.io/spring-framework/docs/4.2.3.RELEASE/spring-framework-reference/html/websocket.html#websocket-stomp-handle-annotations">Websocket annotations</a>
   */
  @MessageMapping("/private-message")
  public void privateMessage(@Payload SocketMessagePart socketMessagePart,
                             StompHeaderAccessor headers,
                             JwtAuthenticationToken principal) {
    if (principal == null) {
      throw new UnAuthorizedException("user not authorized");
    }
    log.info("""
      MessageController > privateMessage:
      sender: {}
      receiver: {}
      port: {}""", socketMessagePart.getSenderName(), socketMessagePart.getReceiverName(), serverPort);
    socketMessagePart.setSenderName((String) JwtUtil.getClaim(principal, JwtUtil.USERNAME));
    simpMessagingTemplate.convertAndSendToUser(socketMessagePart.getReceiverName(), "/private", socketMessagePart); // client listens on /user/{username}/private
  }

}
