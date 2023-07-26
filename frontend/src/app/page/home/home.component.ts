import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {CryptoService} from '../../service/crypto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  res: string = "res";
  res1: string = "res";

  token2: string = "auth server";


  constructor(private authService: AuthService,
              private cryptoService: CryptoService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.cryptoService.withoutHeaderPrivateKey();
    // this.cryptoService.exportKey();
    // this.cryptoService.encryptImg();

    this.token2 = this.authService.getToken();
    this.http.get("/api/test", {responseType: 'text'}).subscribe({
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
    this.http.get("http://localhost:9000/admin/realms/my-realm/users").subscribe({
        next: (res) => {
          console.log("home.component.ts > next(): "+ "users");
          console.table(res);
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
