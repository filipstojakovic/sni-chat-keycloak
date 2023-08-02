package net.etfbl.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.exception.BadRequestException;
import net.etfbl.backend.model.KeyExchangeRequest;
import net.etfbl.backend.util.Base64Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.PrivateKey;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class KeyExchangeService {

  @Value("${server.port}")
  private int serverPort;

  private final CryptoService cryptoService;
  private final AsymmetricEncryption asymmetricEncryption;
  private final SymmetricEncryption symmetricEncryption;

  public static final Map<String, byte[]> userSymmetricKeyMap = new HashMap<>(); // (user,key)

  public void exchangeKey(KeyExchangeRequest keyExchangeRequest, String username) {

    var sessionKey = decryptSessionKey(keyExchangeRequest.getEncryptedSymmetricKeyBase64());
    log.info("MessageService > exchangeKey() on port {}: {}", serverPort, new String(sessionKey));

    var isValid = cryptoService.verifySignature(sessionKey, keyExchangeRequest.getSignatureBase64(), username);
    if (!isValid) {
      throw new BadRequestException("Signature not valid exception");
    }

    userSymmetricKeyMap.put(username, sessionKey); // the old value is replaced if exists
  }

  private byte[] decryptSessionKey(String encryptedSymmetricKeyBase64) {
    try {
      PrivateKey rootPrivateKey = cryptoService.loadUserPrivateKey("rootCA");
      var encodedByteKey = Base64Util.decode(encryptedSymmetricKeyBase64);
      return asymmetricEncryption.decryptWithKey(encodedByteKey, rootPrivateKey);

    } catch (Exception e) {
      log.error("MessageService > decryptSessionKey() :" + "error decryption session key");
      throw new BadRequestException(e.getMessage());
    }

  }
}
