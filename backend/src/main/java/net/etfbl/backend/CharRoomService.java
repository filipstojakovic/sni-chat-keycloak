package net.etfbl.backend;

import org.springframework.stereotype.Service;

@Service
public class CharRoomService {

  public String createChatRoomId(String username1, String username2) {
    return
        username1.compareTo(username2) < 0 ?
            concat(username1, username2)
            :
            concat(username2, username1);
  }

  private String concat(String username1, String username2) {
    return username1 + "-" + username2;
  }


}
