package net.etfbl.backend;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  private final SimpMessagingTemplate simpMessagingTemplate;

  @MessageMapping("/chat.sendMessage")
  @SendTo("/topic/javainuse")
  public MyMessage receiveMessage(@Payload MyMessage myMessage){
    log.info("OVO JE ZNAK DA SE VRACA PORUKA: receiveMessage(@Payload Message message){ ");
    myMessage.setMessage("OVO JE OD SERVERA");
    return myMessage;
  }

  @MessageMapping("/private-message")
  public MyMessage recMessage(@Payload MyMessage myMessage) {
    simpMessagingTemplate.convertAndSendToUser(myMessage.getReceiverName(), "/private", myMessage); // client listens on /user/{username}/private
    System.out.println(myMessage.toString());
    return myMessage;
  }
}
