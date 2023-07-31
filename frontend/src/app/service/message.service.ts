import {EventEmitter, Injectable} from '@angular/core';
import {SocketMessagePart} from '../model/socketMessagePart';
import {ChatMessage} from '../model/chatMessage';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private messages: ChatMessage[] = [];
  public newMessageEmitter = new EventEmitter<ChatMessage>();

  private messagePartsMap = new Map<string, SocketMessagePart[]>(); //  ID, MessageParts[]

  findUserMessages(username: string): ChatMessage[] {
    return this.messages.filter(message => message.senderName === username || message.receiverName === username);
  }

  addMessagePart(newMessagePart: SocketMessagePart) {

    const id = newMessagePart.id;
    let messageParts = this.messagePartsMap.get(id)

    if (messageParts == null) {
      messageParts = [newMessagePart];
      this.messagePartsMap.set(id, messageParts)
    } else {
      messageParts.unshift(newMessagePart);
    }

    if (messageParts.length === newMessagePart.totalParts) {
      const chatMessage = this.combineSocketMessageParts(messageParts);
      this.addChatMessage(chatMessage);
    }
  }

  addChatMessage(chatMessage: ChatMessage) {
    this.messages.unshift(chatMessage);
    this.newMessageEmitter.emit(chatMessage);
  }

  combineSocketMessageParts(messageParts: SocketMessagePart[]): ChatMessage {

    const combinedMessageParts = messageParts.sort((x: SocketMessagePart, y: SocketMessagePart) => x.partNumber - y.partNumber)
      .map((part: SocketMessagePart) => part.messagePart)
      .join("");

    const randomPart = messageParts[0];
    return new ChatMessage(randomPart.id, randomPart.senderName, randomPart.receiverName, combinedMessageParts);
  }

}
