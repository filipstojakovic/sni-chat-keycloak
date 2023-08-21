import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {SocketService} from '../../socket.service';
import {SocketMessagePart} from '../../model/socketMessagePart';
import {MessageService} from '../../service/message.service';
import {environment} from '../../../environments/environment.development';
import {StegeService} from '../../service/stege.service';
import {AsymmetricService} from '../../service/asymmetric.service';
import {UtilService} from '../../service/util.service';
import {v4 as uuid} from 'uuid';
import {ChatMessage} from '../../model/chatMessage';
import {KeyExchangeService} from '../../service/key-exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild("messageTextField") messageTextFieldElement: ElementRef;
  availableUsers: User[] = []
  selectedUser: User | null = null;
  currentUserMessages: ChatMessage[];

  messageText: string = "";

  constructor(private authService: AuthService,
              private asymmetric: AsymmetricService,
              private keyExchangeService: KeyExchangeService,
              private userService: UserService,
              private socketService: SocketService,
              private messageService: MessageService,
              private stege: StegeService,
              private util: UtilService,
  ) {
  }

  async ngOnInit() {

    await this.asymmetric.loadCerts();
    environment.resourceServersPorts.forEach(async (port) => await this.keyExchangeService.exchangeKeysWithServer(port))

    this.userService.getAllUsers().subscribe(users => {
      this.availableUsers = users.filter(user => user.username != this.authService.getUsername());
    });

    this.messageService.newMessageEmitter.subscribe((chatMessage) => {
      this.currentUserMessages = this.messageService.findUserMessages(this.selectedUser.username)
    })
    this.socketService.connect().subscribe({
        next: (stompSocketMessagePart) => {
          const socketMessagePart: SocketMessagePart = JSON.parse(stompSocketMessagePart);
          if (socketMessagePart.port === environment.resourceServersPorts[0]) {
            socketMessagePart.partNumber = this.stege.decryptMessage(socketMessagePart.partNumber);
          } else {
            socketMessagePart.partNumber = this.util.base64ToString(socketMessagePart.partNumber)
          }
          this.messageService.decryptMessagePart(socketMessagePart, socketMessagePart.port);
          this.messageService.addMessagePart(socketMessagePart);
        },
        error: (err) => {
          console.error(err.message);
        },
      },
    )

  }

  onUserSelectionChange(event: any) {
    this.selectedUser = event.options[0].value;
    this.currentUserMessages = this.messageService.findUserMessages(this.selectedUser.username);

  }

  sendMessage(event: any) {
    console.log("home.component.ts > sendMessage(): " + "enter");
    event.preventDefault();
    if (this.messageText.trim() === '') {
      return;
    }
    if (this.selectedUser == null) {
      return;
    }

    const id = uuid();
    const chatMessage = new ChatMessage(id, this.currentLoggedInUser, this.selectedUser.username, this.messageText);

    const messageParts: string[] = this.util.divideStringRandomly(this.messageText);

    messageParts.forEach(async (currentMessagePart, index) => {

      const serverPortIndex = index % environment.resourceServersPorts.length;
      const serverPort = environment.resourceServersPorts[serverPortIndex];

      const encryptBase64MessagePart = this.messageService.encryptMessagePart(serverPort, currentMessagePart);
      let stegeIndex: string;
      if (serverPort === environment.resourceServersPorts[0]) {
        stegeIndex = await this.stege.encryptMessage(index + "");
      } else {
        stegeIndex = this.util.stringToBase64(index + "");
      }
      const socketMessagePart = new SocketMessagePart(
        id,
        encryptBase64MessagePart,
        this.currentLoggedInUser,
        this.selectedUser.username,
        stegeIndex,
        messageParts.length);
      this.socketService.sendMessage(
        serverPort,
        JSON.stringify(socketMessagePart));
    })

    this.messageService.addChatMessage(chatMessage);

    this.messageText = "";
    this.messageTextFieldElement.nativeElement.focus();
  }

  get currentLoggedInUser(): string {
    return this.authService.getUsername();
  }
}
