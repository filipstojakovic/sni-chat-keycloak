package net.etfbl.backend;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatMessageService {

  private static final Map<String, List<MyMessage>> messages = new HashMap<>();

  public void addMessage(String chatId, MyMessage myMessage) {
    if (messages.containsKey(chatId)) {
      List<MyMessage> existingMessages = messages.get(chatId);
      existingMessages.add(myMessage);

    } else {
      List<MyMessage> newMessages = new ArrayList<>();
      newMessages.add(myMessage);
      messages.put(chatId, newMessages);
    }
  }

  public List<MyMessage> getCharRoomMessages(String chatId) {
    return messages.get(chatId);
  }

}
