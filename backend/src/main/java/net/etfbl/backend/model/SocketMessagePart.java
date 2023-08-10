package net.etfbl.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessagePart {

  private String id;
  private String senderName;
  private String receiverName;
  private String messagePart;

  private Long partNumber;
  private Long totalParts;
  private Long port;

}
