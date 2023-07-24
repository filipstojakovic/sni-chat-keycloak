import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Base64 from 'crypto-js/enc-base64';
import CryptoJS from 'crypto-js'
import WordArray from 'crypto-js/lib-typedarrays';
import Steganography from './Steganography';


@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  constructor(private http: HttpClient) {
  }

  // convert String to WordArray
  public stringToWordArray(text: string): WordArray {
    return CryptoJS.enc.Utf8.parse(text);
  }

  public wordArrayToString(wordArray: WordArray) {
    return wordArray.toString(CryptoJS.enc.Utf8);
  }

  public encodeBase64(text: string) {
    const wordArray = this.stringToWordArray(text);
    return Base64.stringify(wordArray)
  }

  public decodeBase64(text: string): string {
    const wordArray = Base64.parse(text);
    return this.wordArrayToString(wordArray);
  }

  encryptImg() {
    this.http.get('assets/png.png', { responseType: 'arraybuffer' }).subscribe({
          next: (res) => {

            const message = 'keep it secret, keep it safe' // string or buffer
            const stege = new Steganography();

            const image = stege.hideMessage(res, message);
            // const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
            const base64String = this.arrayBufferToBase64(image);
            console.log(base64String);

            const decodeBase64 = this.base64ToArrayBuffer(base64String);
            const secret = stege.retrieveMessage(decodeBase64);
            console.log("decoded: " + secret);
          },
          error: (err) => {
            console.error(err.message);
          },
        },
    )

  }

  arrayBufferToBase64(buffer): string {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  exportKey() {
    this.http.get('assets/cert.crt', { responseType: 'text' })
        .subscribe(data => {


          // const qwe = Certificate.exportPublicKey(data);
          // console.log(qwe)
          //
          // const asd = Forge.pki.privateKeyFromPem(data);
          //
          // const res = asd.decrypt("Au9kPcmy1sB/HRZ3Ry5qhRB1/DWafplITa4nsOFUPce3K3cFLt/JXav7DWxzOttqjB6nyyFfvNuxo5pMAE8yAXRJPzqd5Lb2R7uDTVywn+7tWCTc+oZaNbTfZbVmL/OCCOkSF3aGjui5KadV9T4TFsCNlX9sBEMviWK9nLQMsYhdOTGdiemLcBZft5IXhwUUt2O3y01ZH3rWJBhjbDeD0jVF49GTXutCSBpIh7p+Db1kRyEElfBYLRCA6NBlgb2F7JJjCmXGDJ7w2CnF3yHAM5qwW9OX0XBSe74BS/WE4MqT7OYBVigf93c11ANiUFTnZ1WytRL+eBE8Ogia9FNaAQ==");
          //

          // console.log("crypto.service.ts > (): "+ res);
          // var wordArray = CryptoJS.enc.Utf8.parse('Hello, World!');
          // console.log("crypto.service.ts > (): " + Base64.stringify(wordArray));
        });
  }
}
