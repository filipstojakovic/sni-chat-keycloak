package net.etfbl.backend;

import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileInputStream;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

@RestController
public class TestController {

  private final RestTemplate restTemplate;
  @Value("${server.port}")
  private int serverPort;

  public TestController(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.build();
  }

  @GetMapping("api/test")
  public String test(@AuthenticationPrincipal Jwt jwt) {
    // test secured method
    return "test security from port: " + serverPort;
  }

  public static final String X_509 = "X.509";

  @GetMapping("test/cert")
  public String base64CertificatePublicKey() throws Exception {
    File file = ResourceUtils.getFile("classpath:certs/users/localhostcrt.pem");
    CertificateFactory factory = CertificateFactory.getInstance(X_509);
    var test = (X509Certificate) factory.generateCertificate(new FileInputStream(file));

    PublicKey publicKey = test.getPublicKey();

    byte[] pubKey = publicKey.getEncoded();
    String base64Key = Base64.encode(pubKey).toString();

    return base64Key;
  }

}
