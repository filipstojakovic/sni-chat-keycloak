package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.CharRoomService;
import net.etfbl.backend.ChatMessageService;
import net.etfbl.backend.model.MyMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final ChatMessageService chatMessageService;
  private final CharRoomService charRoomService;
  @Value("${server.port}")
  private int serverPort;

  /**
   * <a href="https://docs.spring.io/spring-framework/docs/4.2.3.RELEASE/spring-framework-reference/html/websocket.html#websocket-stomp-handle-annotations">Websocket annotations</a>
   */
  @MessageMapping("/private-message")
  public void privateMessage(@Payload MyMessage myMessage,
                             StompHeaderAccessor headers,
                             JwtAuthenticationToken principal) {

    log.info("MessageController > private:" + "ovo je na serveru port: " + serverPort);
    myMessage.setMessage(myMessage.getMessage() + " port: " + serverPort);
    simpMessagingTemplate.convertAndSendToUser(myMessage.getReceiverName(), "/private", myMessage); // client listens on /user/{username}/private
  }

}
