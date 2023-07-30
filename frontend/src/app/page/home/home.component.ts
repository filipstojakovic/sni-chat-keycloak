import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {CryptoService} from '../../service/crypto.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {StompService} from '../../stomp.service';
import {Message} from '../../model/message';
import {MessageService} from '../../service/message.service';
import {environment} from '../../../environments/environment.development';
import {StegeService} from '../../service/stege.service';
import {AsymmetricService} from '../../service/asymmetric.service';
import {SymmetricService} from '../../service/symmetric.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild("messageTextField") messageTextFieldElement: ElementRef;
  availableUsers: User[] = []
  selectedUser: User | null = null;
  currentUserMessages: Message[];

  messageText: string = "";

  constructor(private authService: AuthService,
              private cryptoService: CryptoService,
              private asymmetric: AsymmetricService,
              private symmetric: SymmetricService,
              private userService: UserService,
              private stompService: StompService,
              private messageService: MessageService,
              private stege: StegeService,
  ) {
  }

  async ngOnInit() {
    this.userService.getAllUsers().subscribe(users => {
      this.availableUsers = users.filter(user => user.username != this.authService.getUsername());
    });

    environment.resourceServersPorts.forEach(port => {
      this.stompService.connect(port);
      //private stuff
      const userMessagesUrl = `/user/${this.authService.getUsername()}/private`
      this.stompService.subscribe(port, userMessagesUrl, (message) => {
        const mess: Message = JSON.parse(message.body);
        console.log("receiving private message: " + JSON.stringify(mess, null, 2));
        this.messageService.addMessage(mess);
        this.currentUserMessages.unshift(mess);
        // this.messages.unshift(mess);
      });
    })

    await this.asymmetric.loadCerts();
    this.asymmetric.test("message is secret");

    // this.symmetric.testSymmetricEncryption()
  }

  get selectedUserMessages(): Message[] {
    if (this.selectedUser)
      return this.messageService.findUserMessages(this.selectedUser.username);
    return [];
  }

  onUserSelectionChange(event: any) {
    this.selectedUser = event.options[0].value;
    this.currentUserMessages = this.messageService.findUserMessages(this.selectedUser.username);
  }

  sendMessage(event: any) {
    if (this.messageText.trim() === '') {
      return;
    }
    if (this.selectedUser == null) {
      return;
    }
    event.preventDefault();

    const loggedInUser = this.authService.getUsername();
    const message = new Message(this.messageText, loggedInUser, this.selectedUser.username);
    this.messageService.addMessage(message);
    this.currentUserMessages.unshift(message);
    this.stompService.sendMessage(8080, "/api/private-message", JSON.stringify(message));
    console.log("home.component.ts > sendMessage(): " + JSON.stringify(message, null, 2));
    this.messageText = "";
    this.messageTextFieldElement.nativeElement.focus();
  }
}
