package net.etfbl.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyMessage {

  private String senderName;
  private String receiverName;
  private String message;
  private Date timestamp;

//     private Status status;
  // getters and setters
}
