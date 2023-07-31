package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.ChatRoomService;
import net.etfbl.backend.exception.UnAuthorizedException;
import net.etfbl.backend.model.ChatRoomKey;
import net.etfbl.backend.model.SocketMessagePart;
import net.etfbl.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final ChatRoomService chatRoomService;
  @Value("${server.port}")
  private int serverPort;

  @PostMapping("api/message/{username}")
  private ChatRoomKey createRoomCode(@PathVariable String username,
                                     @AuthenticationPrincipal JwtAuthenticationToken principal) {

    String chatRoomId = chatRoomService.createChatRoomId(username, JwtUtil.getUsername(principal));
    return null;
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
