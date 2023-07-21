package net.etfbl.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyMessage {

    private String senderName;
    private String receiverName;
    private String message;
//     private Status status;
    // getters and setters
}
