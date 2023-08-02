import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {StompService} from '../../stomp.service';
import {SocketMessagePart} from '../../model/socketMessagePart';
import {MessageService} from '../../service/message.service';
import {environment} from '../../../environments/environment.development';
import {StegeService} from '../../service/stege.service';
import {AsymmetricService} from '../../service/asymmetric.service';
import {SymmetricService} from '../../service/symmetric.service';
import {UtilService} from '../../service/util.service';
import {v4 as uuid} from 'uuid';
import {ChatMessage} from '../../model/chatMessage';
import * as Stomp from 'stompjs'
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
              private symmetric: SymmetricService,
              private keyExchangeService: KeyExchangeService,
              private userService: UserService,
              private stompService: StompService,
              private messageService: MessageService,
              private stege: StegeService,
              private util: UtilService,
  ) {
  }

  async ngOnInit() {
    await this.asymmetric.loadCerts(); //TODO: load just root cert

    this.userService.getAllUsers().subscribe(users => {
      this.availableUsers = users.filter(user => user.username != this.authService.getUsername());
    });

    this.messageService.newMessageEmitter.subscribe((chatMessage) => {
      this.currentUserMessages = this.messageService.findUserMessages(this.selectedUser.username)
    })

    environment.resourceServersPorts.forEach(port => {
      this.keyExchangeService.exchangeKeysWithServer(port);

      const userMessagesUrl = `/user/${this.authService.getUsername()}/private`
      this.stompService.connect(port);
      this.stompService.subscribe(port, userMessagesUrl, (stompSocketMessagePart: Stomp.Message) => {
        const socketMessagePart: SocketMessagePart = JSON.parse(stompSocketMessagePart.body);
        const symmetricKey = this.keyExchangeService.getSessionKey(port);
        const decryptedMessagePart = this.symmetric.decryptMessage(socketMessagePart.messagePart,symmetricKey);
        console.log("home.component.ts > decryptedMessagePart(): "+ decryptedMessagePart);
        socketMessagePart.messagePart = decryptedMessagePart;
        this.messageService.addMessagePart(socketMessagePart);
      });
    })
  }

  onUserSelectionChange(event: any) {
    this.selectedUser = event.options[0].value;
    this.currentUserMessages = this.messageService.findUserMessages(this.selectedUser.username);

  }

  sendMessage(event: any) {
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

    messageParts.forEach((currentMessagePart, index) => {

      const serverPortIndex = index % environment.resourceServersPorts.length;
      const serverPort = environment.resourceServersPorts[serverPortIndex];

      const encryptBase64MessagePart = this.messageService.encryptMessagePart(serverPort,currentMessagePart);
      const socketMessagePart = new SocketMessagePart(id,
        encryptBase64MessagePart,
        this.currentLoggedInUser,
        this.selectedUser.username,
        index,
        messageParts.length);
      this.stompService.sendMessage(
        serverPort,
        "/api/private-message",
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
