package net.etfbl.backend.consumer;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class QueueConsumer {

  @Value("${rabbitmq.exchange.name}")
  private String exchange;
  @Value("${rabbitmq.routing.key}")
  private String routingKey;
  private final RabbitTemplate rabbitTemplate;

  //@Headers MessageHeaders messageHeaders
  //@Header("X-Header") String customHeader
  @RabbitListener(queues = { "${rabbitmq.queue.from-name}" })
  public void receive(@Payload Dummy dummy) {
    System.out.println("Prvi queue " + dummy);

    rabbitTemplate.convertAndSend(exchange, routingKey, dummy);
    rabbitTemplate.convertAndSend("client", dummy);
  }

  @RabbitListener(queues = { "${rabbitmq.queue.to-name}" })
  public void receiver(@Payload Dummy dummy) {

    System.out.println("Drugi queue " + dummy);
  }

}
