package net.etfbl.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomKey {

  private String chatRoomId;
  private String encryptedByUser;
  private String encryptedSymmetricKey;
}
