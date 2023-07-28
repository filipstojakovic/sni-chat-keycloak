import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {CryptoService} from '../../service/crypto.service';
import {UserService} from '../../service/user.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items = [1, 2, 3, 4, 5];
  res: string = "res";
  res1: string = "res";

  token2: string = "auth server";


  constructor(private authService: AuthService,
              private cryptoService: CryptoService,
              private http: HttpClient,
              private userService: UserService
  ) {
  }

  ngOnInit(): void {
    // this.cryptoService.symmetricEncryption();
    // this.cryptoService.withoutHeaderPrivateKey();
    // this.cryptoService.exportKey();
    this.cryptoService.imageEncryptV2();

    this.token2 = this.authService.getToken();
    this.http.get("/api/test", { responseType: 'blob' }).subscribe({
        next: (res) => {
          console.log("home.component.ts > next(): " + JSON.stringify(res, null, 2));
          this.res = JSON.stringify(res);
        },
        error: (err) => {
          console.log("error(): res: " + err.message);
        },
      },
    )


    //TODO: get users from server
    this.userService.getAllUsers().subscribe({
        next: (res) => {
          const users: User[] = res;
          console.log("home.component.ts > next(): " + "users");
          console.log(users);
        },
        error: (err) => {
          console.error(err.message);
        },
      },
    )


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

  logout() {
    this.authService.logout()
  }
}
