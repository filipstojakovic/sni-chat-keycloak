import {Component, OnInit} from '@angular/core';
import {StompServiceService} from '../../stomp-service.service';
import {CryptoService} from '../../service/crypto.service';
import {AuthService} from '../../auth/auth.service';

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
  receiverName: string = "";
  timestamp: Date = new Date();
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {

  messageToSend: string = "ovo je neki test";
  receivedMessages: Message[] = [];

  constructor(private stompService: StompServiceService,
              private cryptoService: CryptoService,
              private auth: AuthService) {
  }

  ngOnInit() {

    this.stompService.connect(8080);
    // this.stompService.connect(8081);

    // this.stompService.subscribe("/chatroom/public", (payload) => {
    //   console.log("chat-room.component.ts > (): " + "something happend");
    //
    //   var payloadData = JSON.parse(payload.body);
    //   console.log("chat-room.component.ts > (): " + JSON.stringify(payloadData, null, 2));
    // })


    //private stuff
    this.stompService.subscribe(8080, "/user/" + this.auth.getUsername() + "/private", (message) => {
      const mess = JSON.parse(message.body);
      console.log("private message: " + JSON.stringify(mess, null, 2));
    });

    // this.stompService.subscribe(8081, "/user/" + this.auth.getUsername() + "/private", (message) => {
    //   const mess = JSON.parse(message.body);
    //   console.log("private message: " + JSON.stringify(mess, null, 2));
    // });
  }

  sendMessage() {
    const message: Message = {message: this.messageToSend, receiverName: "user1", timestamp: new Date};
    this.stompService.sendMessage(8080,"/api/message", JSON.stringify(message));
    this.messageToSend = '';
  }

  sendPrivateMessage() {
    const message: Message = {message: this.messageToSend, receiverName: "user1", timestamp: new Date};
    this.stompService.sendMessage(8080,"/api/private-message", JSON.stringify(message));
    // this.stompService.sendMessage(8081,"/api/private-message", JSON.stringify(message));

    this.messageToSend = '';
  }


}
