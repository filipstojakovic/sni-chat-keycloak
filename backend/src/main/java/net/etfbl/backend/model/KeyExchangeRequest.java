package net.etfbl.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeyExchangeRequest {

  private String encryptedSymmetricKeyBase64;
  private String signatureBase64;
}
