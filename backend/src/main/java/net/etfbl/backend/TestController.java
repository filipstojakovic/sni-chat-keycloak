package net.etfbl.backend;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@RestController
@RequestMapping("api")
public class TestController {

  private final RestTemplate restTemplate;

  public TestController(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.build();
  }

  @GetMapping("test")
  public String test(@AuthenticationPrincipal Jwt jwt) {
    // test secured method
    return "test security";
  }

  @GetMapping("users")
  public String getPostsPlainJSON(@AuthenticationPrincipal Jwt jwt) {

    String url = "http://localhost:9000/admin/realms/test-realm/users";
    HttpHeaders headers = new HttpHeaders();
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    headers.set("Authorization", "Bearer " + jwt.getTokenValue());

    // build the request
    HttpEntity request = new HttpEntity(headers);
    ResponseEntity<String> response = this.restTemplate.exchange(url, HttpMethod.GET, request, String.class);
    return response.getBody();

  }
}
