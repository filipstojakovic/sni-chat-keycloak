import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {CryptoService} from '../../service/crypto.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';
import {StompService} from '../../stomp.service';
import {Message} from '../../model/message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild("messageTextField") messageTextFieldElement : ElementRef;
  availableUsers: User[] = []
  selectedUser: User | null = null;

  messages: Message[] = [];

  messageText: string = "";

  constructor(private authService: AuthService,
              private cryptoService: CryptoService,
              private http: HttpClient,
              private userService: UserService,
              private stompService: StompService,
  ) {
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.availableUsers = users.filter(user => user.username != this.authService.getUsername());
    });

    this.stompService.connect(8080);

    //private stuff
    const userMessagesUrl = `/user/${this.authService.getUsername()}/private`
    this.stompService.subscribe(8080, userMessagesUrl, (message) => {
      const mess: Message = JSON.parse(message.body);
      console.log("private message: " + JSON.stringify(mess, null, 2));
      this.messages.unshift(mess);
      // this.messages.unshift(mess);
    });

    // this.cryptoService.symmetricEncryption();
    // this.cryptoService.withoutHeaderPrivateKey();
    // this.cryptoService.exportKey();
    // this.cryptoService.imageEncryptV2();


    // this.http.get("/api1/test",{responseType: 'text'}).subscribe({
    //       next: (res) => {
    //         console.log("home.component.ts > next(): "+ JSON.stringify(res, null, 2));
    //         this.res1 = JSON.stringify(res);
    //       },
    //       error: (err) => {
    //         console.log("error(): res1: "+ err.message);
    //       },
    //     },
    // )
  }

  onUserSelectionChange(event: any) {
    this.selectedUser = event.options[0].value;
  }

  sendMessage() {
    if (this.messageText.trim() === '') {
      return;
    }
    if (this.selectedUser == null) {
      return;
    }

    const loggedInUser = this.authService.getUsername();
    const message = new Message(this.messageText, loggedInUser, this.selectedUser.username);
    this.messages.unshift(message);
    this.stompService.sendMessage(8080, "/api/private-message", JSON.stringify(message));
    console.log("home.component.ts > sendMessage(): " + JSON.stringify(message, null, 2));
    this.messageText = "";
    this.messageTextFieldElement.nativeElement.focus();
  }
}
