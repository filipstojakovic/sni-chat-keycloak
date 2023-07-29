import {Injectable} from '@angular/core';
import {Message} from '../model/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private _messages: Message[] = [];

  constructor() {
  }

  findUserMessages(username: string) {
    return this._messages.filter(message => message.senderName === username || message.receiverName === username);
  }

  addMessage(newMessage: Message) {
    this._messages.unshift(newMessage);
  }

  get messages(): Message[] {
    return this._messages;
  }

}
