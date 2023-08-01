package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.exception.UnAuthorizedException;
import net.etfbl.backend.model.KeyExchangeRequest;
import net.etfbl.backend.model.SocketMessagePart;
import net.etfbl.backend.service.CryptoService;
import net.etfbl.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Controller
public class MessageController {

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final CryptoService cryptoService;
  @Value("${server.port}")
  private int serverPort;
  private final Map<String, String> symmetricKeyMap = new HashMap<>();

  public static String createSignature(String dataToSign, PrivateKey privateKey) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
    Signature signature = Signature.getInstance("SHA256withRSA");
    signature.initSign(privateKey);

    // Update the signature with the data to be signed
    byte[] dataBytes = dataToSign.getBytes(StandardCharsets.UTF_8);
    signature.update(dataBytes);

    // Generate the signature
    byte[] digitalSignature = signature.sign();

    // Encode the digital signature to a string (for demonstration purposes)
    String encodedSignature = Base64.getEncoder().encodeToString(digitalSignature);
    return encodedSignature;
  }

  @ResponseBody
  @PostMapping("api/key-exchange")
  public ResponseEntity<Void> keyExchange(@RequestBody KeyExchangeRequest keyExchangeRequest,
                                          @AuthenticationPrincipal JwtAuthenticationToken principal) throws Exception {

    var privateKey = cryptoService.loadUserPrivateKey("user");
    var signatureBase64 = "G/cQ9s7nkk5gX6jjl6gVtLLwJjYMiYt23vsPZMRQ4OPcrZFonQ+BDLcWO6pyFzMdGEaIeqRgPsef14wMYlfLwPOqFjz//OZtKiwmWOjH/9ceRQ4xbzW0rzCKMOkxTv9d1X8G6jL3PB5p8jd/aEu4Wm6O3d8wOIEMiUoIEqkmP22XYKVDT/B1zOjxf8KbiUUqOM/jDXEjfcflynBQtBfImeNZV/vLOapoPIk+W6GWjFf2PeFxOVgcISNRUtvtL1kjL9cxRu52cVqIQYiObEsT1IVgu7t3hs/ak1Kpu9f4Ke5eiXXpJDu2C4mTxewE4qOG+hUruE3cS41FN+xJ/Hlo6A==";
    signatureBase64 = createSignature("qwerty", privateKey);
    var cert = cryptoService.loadUserCertificate("user");
    var pubKey = cert.getPublicKey();

    var res = cryptoService.verifySignature("cXdlcnR5", signatureBase64, "user");
//     var signatureDecodedBytes = Base64Util.decode(signatureBase64);
//     var decrypt = AsymmetricEncryption.decryptWithKey(signatureDecodedBytes,pubKey);

    return ResponseEntity.ok().body(null);
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
