package net.etfbl.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("api")
public class TestController {

  private final RestTemplate restTemplate;
  @Value("${server.port}")
  private int serverPort;

  public TestController(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.build();
  }

  @GetMapping("test")
  public String test(@AuthenticationPrincipal Jwt jwt) {
    // test secured method
    return "test security from port: " + serverPort;
  }

}
