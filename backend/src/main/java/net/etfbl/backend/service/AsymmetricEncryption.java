package net.etfbl.backend.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.security.Key;

@Service
public class AsymmetricEncryption {

  public static final String RSA_ALGO = "RSA";
  public static final String BC_PROVIDER = "BC";

  public byte[] encryptWithKey(byte[] content, Key key) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_ALGO, BC_PROVIDER);
    cipher.init(Cipher.ENCRYPT_MODE, key);
    return cipher.doFinal(content);
  }

  public byte[] decryptWithKey(byte[] content, Key key) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_ALGO, BC_PROVIDER);
    cipher.init(Cipher.DECRYPT_MODE, key);
    return cipher.doFinal(content);
  }
}
