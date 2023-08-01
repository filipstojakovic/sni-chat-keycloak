package net.etfbl.backend.service;

import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.exception.BadRequestException;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Service
public class CryptoService {

  public static final String X_509 = "X.509";

  public X509Certificate loadUserCertificate(String username) {

    try {
      CertificateFactory factory = CertificateFactory.getInstance(X_509);
      File file = ResourceUtils.getFile("classpath:certs/" + username + ".crt");
      return (X509Certificate) factory.generateCertificate(new FileInputStream(file));

    } catch (FileNotFoundException ex) {
      throw new BadRequestException("Certificate not found");
    } catch (CertificateException ex) {
      log.error("error loading certificate factory instance");
      ex.printStackTrace();
      throw new BadRequestException("Certificate type not found");
    }
  }

  public byte[] loadUserPublicKeyByte(String username) {
    return loadUserPublicKey(username).getEncoded();
  }

  public PublicKey loadUserPublicKey(String username) {

    var userCertificate = loadUserCertificate(username);
    return userCertificate.getPublicKey();
  }

  public PrivateKey loadUserPrivateKey(String username) {
    try {
      File file = ResourceUtils.getFile("classpath:certs/" + username + ".key");
      try (FileReader keyReader = new FileReader(file);
           PemReader pemReader = new PemReader(keyReader)) {

        PemObject pemObject = pemReader.readPemObject();
        byte[] content = pemObject.getContent();
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(content);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePrivate(privateKeySpec);
      }
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    return null;
  }

  public boolean verifySignature(String dataBase64, String signatureBase64, String user) {
    try {
      var certificate = loadUserCertificate(user);
      PublicKey publicKey = certificate.getPublicKey();

      byte[] data = Base64.getDecoder().decode(dataBase64);
      byte[] signature = Base64.getDecoder().decode(signatureBase64);

      Signature sig = Signature.getInstance("SHA256WithRSA");//(certificate.getSigAlgName());
      sig.initVerify(publicKey);
      sig.update(data);

      // Verify the signature
      return sig.verify(signature);
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }
}
