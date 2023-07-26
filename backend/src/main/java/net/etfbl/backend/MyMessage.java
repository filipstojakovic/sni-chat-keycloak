package net.etfbl.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyMessage {

  private String senderName;
  private String receiverName;
  private String message;
  private LocalDateTime timestamp;

//     private Status status;
  // getters and setters
}
