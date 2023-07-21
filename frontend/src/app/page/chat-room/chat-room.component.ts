import {Component, OnDestroy, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Subscription} from 'rxjs';
import {StompServiceService} from '../../stomp-service.service';

class UserData {
  username: string = "";
  receivername: string = "";
  connected: boolean = false;
  message: string = "";
}

class MessageType {
  senderName: string = "";
  receiverName: string = "";
  message: string = "";
  status: string = "";

}

export class Message {
  message: string = "test content";
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {

  messageToSend: string = "ovo je neki test";
  receivedMessages: Message[] = [];

  constructor(private stompService: StompServiceService) { }

  ngOnInit() {
    this.stompService.subscribe("/chatroom/public",(payload)=>{
      console.log("chat-room.component.ts > (): "+ "something happend");

      var payloadData = JSON.parse(payload.body);
      console.log("chat-room.component.ts > (): "+ JSON.stringify(payloadData, null, 2));
    })
  }

  sendMessage() {
    const message: Message = { message: this.messageToSend };
    this.stompService.sendMessage(JSON.stringify(message));
    this.messageToSend = '';
  }
}
