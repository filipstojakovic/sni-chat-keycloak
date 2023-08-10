package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.model.SocketMessagePart;
import net.etfbl.backend.service.MessageService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  @Value("${server.port}")
  private int serverPort;

  private final MessageService messageService;
  private final RabbitTemplate rabbitTemplate;

  //@Header("X-Header") String customHeader or @Headers MessageHeaders messageHeaders
  @RabbitListener(queues = { "${rabbitmq.queue.name}" })
  public void receive(@Payload SocketMessagePart socketMessagePart) {
    log.info("""
      MessageController > privateMessage:
      sender: {}
      receiver: {}
      port: {}""", socketMessagePart.getSenderName(), socketMessagePart.getReceiverName(), serverPort);

//     socketMessagePart = messageService.swapSenderReceiverMessageEncryption(socketMessagePart); //TODO: uncomment me

    rabbitTemplate.convertAndSend(socketMessagePart.getReceiverName(), socketMessagePart);
  }
}
