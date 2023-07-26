package net.etfbl.backend;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
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

  /**
   * <a href="https://docs.spring.io/spring-framework/docs/4.2.3.RELEASE/spring-framework-reference/html/websocket.html#websocket-stomp-handle-annotations">Websocket annotations</a>
   */
  @MessageMapping("/message")
  @SendTo("/chatroom/public")
  public MyMessage receiveMessage(@Payload MyMessage myMessage,
                                  StompHeaderAccessor headers,
                                  JwtAuthenticationToken principal) {
    log.info("OVO JE ZNAK DA SE VRACA PORUKA: receiveMessage(@Payload Message message){ ");
    String name = (String) JwtUtil.getClaim(principal, JwtUtil.USERNAME);
    myMessage.setMessage("OVO JE PORUKA OD SERVERA BURAZ");
    return myMessage;
  }

  @MessageMapping("/private-message")
  public MyMessage recMessage(@Payload MyMessage myMessage) {

    log.info("MessageController > recMessage() :" + "ovo je na serveru");
    simpMessagingTemplate.convertAndSendToUser(myMessage.getReceiverName(), "/private", myMessage); // client listens on /user/{username}/private
    System.out.println(myMessage.toString());
    return myMessage;
  }

}
