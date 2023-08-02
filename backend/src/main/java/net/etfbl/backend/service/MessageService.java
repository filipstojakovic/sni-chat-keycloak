package net.etfbl.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.etfbl.backend.exception.BadRequestException;
import net.etfbl.backend.model.SocketMessagePart;
import net.etfbl.backend.util.Base64Util;
import net.etfbl.backend.util.JwtUtil;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Slf4j
@RequiredArgsConstructor
@Service
public class MessageService {

  private final SymmetricEncryption symmetricEncryption;

  public SocketMessagePart swapSenderReceiverMessageEncryption(SocketMessagePart socketMessagePart, JwtAuthenticationToken principal) {
    try {
      var messagePart = decryptSenderMessagePart(socketMessagePart.getMessagePart(), principal);
      log.info("MessageController > decrypted part: " + new String(messagePart));
      var encryptedMessagePart = encryptMessagePartForReceiver(messagePart, socketMessagePart.getReceiverName());
      socketMessagePart.setMessagePart(encryptedMessagePart);
      socketMessagePart.setSenderName((String) JwtUtil.getClaim(principal, JwtUtil.USERNAME));
    } catch (Exception ex) {
      log.error("MessageController > privateMessage() :" + ex.getMessage());
      throw new BadRequestException("Error encrypting/decrypting message part");
    }
    return socketMessagePart;
  }

  private byte[] decryptSenderMessagePart(String encryptedBase64MessagePart, JwtAuthenticationToken principal) throws Exception {
    byte[] encryptedMessagePart = Base64Util.decode(encryptedBase64MessagePart);
    SecretKey symmetricKey = symmetricEncryption.generateSecretKey(KeyExchangeService.userSymmetricKeyMap.get(JwtUtil.getUsername(principal)));
    var messagePart = symmetricEncryption.decrypt(symmetricKey, encryptedMessagePart);
    return messagePart;
  }

  private String encryptMessagePartForReceiver(byte[] messagePart, String userReceiver) throws Exception {
    SecretKey symmetricKey = symmetricEncryption.generateSecretKey(KeyExchangeService.userSymmetricKeyMap.get(userReceiver));
    var encryptedMessagePart = symmetricEncryption.encrypt(symmetricKey, messagePart);
    return Base64Util.encodeToString(encryptedMessagePart);
  }
}
