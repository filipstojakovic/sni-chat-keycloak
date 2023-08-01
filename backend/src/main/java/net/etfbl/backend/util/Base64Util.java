package net.etfbl.backend.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Base64Util {

  public static String encodeToString(byte[] data) {
    return Base64.getEncoder().encodeToString(data);
  }

  public static String encodeToString(String data) {
    return encodeToString(data.getBytes(StandardCharsets.UTF_8));
  }

  public static byte[] encode(String data) {
    return Base64.getEncoder().encode(data.getBytes(StandardCharsets.UTF_8));
  }

  public static String decodeToString(String base64Data) {
    return new String(decode(base64Data));
  }

  public static String decodeToString(byte[] base64Data) {
    return new String(Base64.getDecoder().decode(base64Data));
  }

  public static byte[] decode(String base64Data) {
    return decode(base64Data.getBytes(StandardCharsets.UTF_8));
  }

  public static byte[] decode(byte[] base64Data) {
    return Base64.getDecoder().decode(base64Data);
  }
}
