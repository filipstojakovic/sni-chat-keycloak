package net.etfbl.backend.controller;

import lombok.RequiredArgsConstructor;
import net.etfbl.backend.model.KeyExchangeRequest;
import net.etfbl.backend.service.AsymmetricEncryption;
import net.etfbl.backend.service.CryptoService;
import net.etfbl.backend.util.Base64Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.Signature;
import java.util.Base64;

@RequiredArgsConstructor
@RestController
public class TestController {

  public static final String X_509 = "X.509";
  @Value("${server.port}")
  private int serverPort;
  private final CryptoService cryptoService;
  private final AsymmetricEncryption asymmetricEncryption;

  @GetMapping("api/test")
  public String test(@AuthenticationPrincipal Jwt jwt) {
    // test secured method
    return "test security from port: " + serverPort;
  }

  @GetMapping("test/test")
  public String test() {
    // test secured method
    return "test security from port: " + serverPort;
  }

  //TODO: delete me
  @ResponseBody
  @PostMapping("api/test")
  public ResponseEntity<Void> keyExchange(@RequestBody KeyExchangeRequest keyExchangeRequest,
                                          @AuthenticationPrincipal JwtAuthenticationToken principal) throws Exception {

    var privateKey = cryptoService.loadUserPrivateKey("user");
    var signatureBase64 = "G/cQ9s7nkk5gX6jjl6gVtLLwJjYMiYt23vsPZMRQ4OPcrZFonQ+BDLcWO6pyFzMdGEaIeqRgPsef14wMYlfLwPOqFjz//OZtKiwmWOjH/9ceRQ4xbzW0rzCKMOkxTv9d1X8G6jL3PB5p8jd/aEu4Wm6O3d8wOIEMiUoIEqkmP22XYKVDT/B1zOjxf8KbiUUqOM/jDXEjfcflynBQtBfImeNZV/vLOapoPIk+W6GWjFf2PeFxOVgcISNRUtvtL1kjL9cxRu52cVqIQYiObEsT1IVgu7t3hs/ak1Kpu9f4Ke5eiXXpJDu2C4mTxewE4qOG+hUruE3cS41FN+xJ/Hlo6A==";
    signatureBase64 = createSignature("qwerty", privateKey);
    var cert = cryptoService.loadUserCertificate("user");
    var pubKey = cert.getPublicKey();

    var encryptMessageByte = asymmetricEncryption.encryptWithKey("qwerty".getBytes(), cryptoService.loadUserPublicKey("rootCA"));
    var encryptedMessageBase64 = Base64Util.encodeToString(encryptMessageByte);

    var res = cryptoService.verifySignature("cXdlcnR5", signatureBase64, "user");

    return ResponseEntity.ok().body(null);
  }

  public static String createSignature(String dataToSign, PrivateKey privateKey) throws Exception {
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
}
