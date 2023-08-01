package net.etfbl.backend.service;

import javax.crypto.Cipher;
import java.security.Key;

public class AsymmetricEncryption {

  public static final String RSA_ALGO = "RSA";

  public static byte[] encryptWithKey(byte[] content, Key key) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_ALGO);
    cipher.init(Cipher.ENCRYPT_MODE, key);
    return cipher.doFinal(content);
  }

  public static byte[] decryptWithKey(byte[] content, Key key) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_ALGO);
    cipher.init(Cipher.DECRYPT_MODE, key);
    return cipher.doFinal(content);
  }
}
