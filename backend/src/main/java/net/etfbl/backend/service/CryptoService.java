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
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
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
      log.error("CryptoService > loadUserCertificate() :" + "error loading certificate file");
      throw new BadRequestException("Certificate not found");
    } catch (CertificateException ex) {
      log.error("CryptoService > loadUserCertificate() :" + "error loading certificate factory instance");
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
      log.error("CryptoService > loadUserPrivateKey() :" + "Error loading private key");
      throw new BadRequestException("Error loading private key");
    }
  }

  public boolean verifySignature(byte[] data, String signatureBase64, String user) {
    try {
      byte[] signature = Base64.getDecoder().decode(signatureBase64);
      var certificate = loadUserCertificate(user);
      PublicKey publicKey = certificate.getPublicKey();
      Signature sig = Signature.getInstance(certificate.getSigAlgName()); // certificate.getSigAlgName() here is always SHA256withRSA
      sig.initVerify(publicKey);
      sig.update(data);

      return sig.verify(signature);
    } catch (Exception e) {
      log.error("CryptoService > verifySignature() :" + "Error verifying the signature");
      return false;
    }
  }

  public boolean verifySignature(String dataBase64, String signatureBase64, String user) {
    byte[] data = Base64.getDecoder().decode(dataBase64);
    return verifySignature(data, signatureBase64, user);
  }

  public String createSignature(String dataToSign, PrivateKey privateKey) {
    try {
      Signature signature = Signature.getInstance("SHA256withRSA");
      signature.initSign(privateKey);

      byte[] dataBytes = dataToSign.getBytes(StandardCharsets.UTF_8);
      signature.update(dataBytes);

      byte[] digitalSignature = signature.sign();

      return Base64.getEncoder().encodeToString(digitalSignature);
    } catch (NoSuchAlgorithmException | SignatureException | InvalidKeyException e) {
      throw new RuntimeException(e);
    }
  }
}
