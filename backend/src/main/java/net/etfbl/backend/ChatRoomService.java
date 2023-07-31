package net.etfbl.backend;

import net.etfbl.backend.model.ChatRoomKey;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatRoomService {

  private static final Map<String, ChatRoomKey> chatRoomKeyMap = new HashMap<>();

  public String createChatRoomId(String username1, String username2) {
    return
      username1.compareTo(username2) < 0 ?
        concat(username1, username2)
        :
        concat(username2, username1);
  }

  public ChatRoomKey addChatRoomKey(String username,String username2, String key){

    return null;
  }

  public ChatRoomKey getChatRoomKey(String chatRoomId) {
    return chatRoomKeyMap.get(chatRoomId);
  }

  private String concat(String username1, String username2) {
    return username1 + "-" + username2;
  }

}
