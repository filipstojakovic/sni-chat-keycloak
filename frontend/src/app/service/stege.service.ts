import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import steggy from 'steggy';
import {map} from 'rxjs';
import {Buffer} from 'buffer';
import forge from "node-forge";

@Injectable({
  providedIn: 'root',
})
export class StegeService {

  imageBufferPromise: Promise<Buffer>

  constructor(private http: HttpClient) {
    this.imageBufferPromise = this.http.get('assets/confidential.png', { responseType: 'arraybuffer' })
      .pipe(map(imageArrayBuffer => Buffer.from(imageArrayBuffer)))
      .toPromise();
  }

  stringToBase64(text:string){
    return forge.util.encode64(text)
  }

  base64ToString(base64:string){
    return forge.util.decode64(base64);
  }


  async encryptMessage(secretMessage: string) {
    const buffer = await this.imageBufferPromise;
    const concealed = steggy.conceal(/* optional password */)(buffer, secretMessage /*, encoding */)
    return Buffer.from(concealed).toString('base64');
  }

  decryptMessage(image: string) {
    const originalBuffer = Buffer.from(image, 'base64');
    return steggy.reveal(/* optional password */)(originalBuffer /*, encoding */);
  }

}
