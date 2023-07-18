import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token: string = "token";


  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get("/api/test",{responseType: 'text'}).subscribe({
          next: (res) => {
            console.log("home.component.ts > next(): "+ JSON.stringify(res, null, 2));
            this.token = JSON.stringify(res);
          },
          error: (err) => {
            console.log("home.component.ts > error(): "+ err.message);
          },
        },
    )
  }

  logout() {
    this.authService.logout()
  }
}
