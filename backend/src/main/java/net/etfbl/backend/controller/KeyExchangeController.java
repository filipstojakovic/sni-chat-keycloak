package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.model.KeyExchangeRequest;
import net.etfbl.backend.service.MessageService;
import net.etfbl.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
public class KeyExchangeController {

  private final MessageService messageService;

  @PostMapping("api/key-exchange")
  public ResponseEntity<Void> keyExchange(@RequestBody KeyExchangeRequest keyExchangeRequest,
                                          JwtAuthenticationToken principal) {

    messageService.exchangeKey(keyExchangeRequest, JwtUtil.getUsername(principal));
    return ResponseEntity.ok().body(null);
  }

}
