import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  constructor(private http: HttpClient) {
  }


  exportKey() {

    this.http.get('assets/cert.pem', { responseType: 'text' })
        .subscribe(data => {
          console.log(data)

        });
  }
}
