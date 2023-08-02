package net.etfbl.backend.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class SymmetricEncryption {

  public static final String AES = "AES";

  public SecretKey generateSecretKey(String key, String symmetricAlgo) {
    return new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), symmetricAlgo);
  }

  public SecretKey generateSecretKey(byte[] key, String symmetricAlgo) {
    return new SecretKeySpec(key, symmetricAlgo);
  }

  public SecretKey generateSecretKey(String key) {
    return new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), AES);
  }

  public SecretKey generateSecretKey(byte[] key) {
    return new SecretKeySpec(key, AES);
  }

  public byte[] encrypt(SecretKey key, byte[] data, String symmetricAlgo) throws Exception {
    Cipher cipher = Cipher.getInstance(symmetricAlgo);
    cipher.init(Cipher.ENCRYPT_MODE, key);
    return cipher.doFinal(data);
  }

  public byte[] encrypt(SecretKey key, byte[] data) throws Exception {
    return encrypt(key,data,AES);
  }

  public byte[] encrypt(String key, byte[] data, String symmetricAlgo) throws Exception {
    SecretKey secretKey = generateSecretKey(key, symmetricAlgo);
    return encrypt(secretKey, data, symmetricAlgo);
  }

  public byte[] encrypt(String key, byte[] data) throws Exception {
    return encrypt(key, data, AES);
  }

  public byte[] encrypt(String key, String data) throws Exception {
    return encrypt(key, data.getBytes(StandardCharsets.UTF_8));
  }

  // ------------- DECRYPTING -------------

  public byte[] decrypt(SecretKey key, byte[] encryptedData, String symmetricAlgo) throws Exception {
    Cipher cipher = Cipher.getInstance(symmetricAlgo, "BC");
    cipher.init(Cipher.DECRYPT_MODE, key);
    return cipher.doFinal(encryptedData);
  }
  public byte[] decrypt(SecretKey key, byte[] encryptedData) throws Exception {
    return this.decrypt(key,encryptedData,AES);
  }

  public byte[] decrypt(String key, byte[] encryptedData, String symmetricAlgo) throws Exception {
    SecretKey secretKey = generateSecretKey(key, symmetricAlgo);
    return decrypt(secretKey, encryptedData, symmetricAlgo);
  }

  public byte[] decrypt(String key, byte[] encryptedData) throws Exception {
    return decrypt(key, encryptedData, AES);
  }

  public String decrtpyToString(String key, byte[] encryptedData) throws Exception {
    var decrypt = decrypt(key, encryptedData);
    return new String(decrypt);
  }

}
