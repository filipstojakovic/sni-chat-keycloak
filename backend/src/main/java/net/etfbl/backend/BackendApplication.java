package net.etfbl.backend;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.Security;

@EnableRabbit
@SpringBootApplication
public class BackendApplication {

  public static void main(String[] args) {
    Security.addProvider(new BouncyCastleProvider());
    SpringApplication.run(BackendApplication.class, args);
  }

}
