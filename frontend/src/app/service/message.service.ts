import {EventEmitter, Injectable} from '@angular/core';
import {SocketMessagePart} from '../model/socketMessagePart';
import {ChatMessage} from '../model/chatMessage';
import {HttpClient} from '@angular/common/http';
import {SymmetricService} from './symmetric.service';
import {AsymmetricService} from './asymmetric.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private messages: ChatMessage[] = [];
  public newMessageEmitter = new EventEmitter<ChatMessage>();

  private messagePartsMap = new Map<string, SocketMessagePart[]>(); //  ID, MessageParts[]
  private sessionKeys = new Map<number, string>(); //  port, session key


  constructor(private http: HttpClient,
              private symmetric: SymmetricService,
              private asymmetric: AsymmetricService,
  ) {
  }

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

  exchangeKeysWithServer(port: number) {

    const { symmetricKey } = this.symmetric.generateSymmetricKey();

    const whichApi = port % 10;
    const url = `/api${whichApi}/key-exchange`;
    this.http.post(url, null).subscribe({
        next: (res) => {
          console.log("message.service.ts > next(): " + "res");
        },
        error: (err) => {
          console.error(err.message);
        },
      },
    )
    // environment.resourceServersPorts.forEach()
  }

}
