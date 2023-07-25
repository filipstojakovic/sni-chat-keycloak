import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Base64 from 'crypto-js/enc-base64';
import CryptoJS from 'crypto-js'
import WordArray from 'crypto-js/lib-typedarrays';
import Steganography from './Steganography';
import * as forge from 'node-forge'


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

  exportKey() {
    this.http.get('assets/cert.key', { responseType: 'text' })
        .subscribe(data => {

          const ed25519 = forge.pki.ed25519;

          const pubKey = forge.pki.publicKeyFromPem("-----BEGIN PUBLIC KEY-----\n" +
              "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnwlkWTv0CFJhAbgbXIDT\n" +
              "mYKk0ZlVBTvuBaYwZpyWzcDR0iab/ug+XK0CKjHxU+eeymG/q0asJc3vgYexPfEE\n" +
              "45ktb2ePCKUuXLEDHXuwDvKyrBHu0/9XklmgUwKQnGCIQbIpkqdYwZOMULjlu7Te\n" +
              "bRqxhPAN3F/w2xlqRAptU1EhHB+/INuzwvchCpKUXdh9z+l42PKNeGzIXRxMQaOt\n" +
              "axhzsXujrp2EH12PHQhsD67MHPk6tMe7S4E602nNq9gq3ZSHKOLOzmc4VwBHsHay\n" +
              "PBN7aseW7FR+IDGGjg46X3VfeMRJLn4b5DJWpJm00yUvrUUP5+/pJBTpyY4cgQK5\n" +
              "9wIDAQAB\n" +
              "-----END PUBLIC KEY-----");


          const encrypt = pubKey.encrypt("testic");
          const base64 = this.encodeBase64(encrypt);

          console.log("encrypt: " + base64);


          const privateKey = forge.pki.privateKeyFromPem("-----BEGIN RSA PRIVATE KEY-----\n" +
              "MIIEowIBAAKCAQEAnwlkWTv0CFJhAbgbXIDTmYKk0ZlVBTvuBaYwZpyWzcDR0iab\n" +
              "/ug+XK0CKjHxU+eeymG/q0asJc3vgYexPfEE45ktb2ePCKUuXLEDHXuwDvKyrBHu\n" +
              "0/9XklmgUwKQnGCIQbIpkqdYwZOMULjlu7TebRqxhPAN3F/w2xlqRAptU1EhHB+/\n" +
              "INuzwvchCpKUXdh9z+l42PKNeGzIXRxMQaOtaxhzsXujrp2EH12PHQhsD67MHPk6\n" +
              "tMe7S4E602nNq9gq3ZSHKOLOzmc4VwBHsHayPBN7aseW7FR+IDGGjg46X3VfeMRJ\n" +
              "Ln4b5DJWpJm00yUvrUUP5+/pJBTpyY4cgQK59wIDAQABAoIBAConWCTa4k0OYM4O\n" +
              "2ZnEP9HxsfQoe0Oe5fEzYqLgIIy67iKQv0pqjpUL+oXqpPfDbfBgxmgEnH6Mvk4M\n" +
              "BGvRpaUaJdPglCYLemVxOc0nyru7kqZPPomMpc6R2RAHnwMEBzm6mpBXsQvmKwv+\n" +
              "Zk5Bm685oxIEevgNqg65BtSwGtg5PfPZB8NqBaA6YlgOnYSqHQAi9YYz8AXR0xHN\n" +
              "s3V8SZgM89ad4PJN1L3nylc7/wtzE8DI7tll3EblRo2uFOWjZejcLR4GL24f1wcM\n" +
              "bGlih3N+jWog3hp1I3aiSovrBgzmk1YxnJM3PNgGuT0y6eTM5Rf1pMNkkGyLXzXA\n" +
              "Ae12stkCgYEA5ieF1xSib5japZiNQGchYrUn9oCRGBOq9ZdPhQhNpprHpC+KQOsN\n" +
              "2fkHOPBTtc+DUJALlVpzeWrZr8gyYYBW0xl05Kgp2H27j9V20oLhztc3NyMUqGFQ\n" +
              "GJrMIeS+07dj8mo95ldFtUilyjuDHmBPTjzgj6++DjfD+xeuc5Me1pUCgYEAsOVg\n" +
              "vx2wwUPT2UzW5bXoDZY5jHehqk3BLTDefQyCWt6pYgBzhZIMJi6VDfZC/tqz0EMR\n" +
              "7y5uZ+r6I3is00pQ/ymHbeNW5OQkS3T5ZQ7xnf8C9AalD4jrwdLUNt6qSSshrXn5\n" +
              "hDzdltp0K1Krsob0cnhTN9v6roh1uFea5py851sCgYAMByq+d8yZanKazuMq53je\n" +
              "MLt67XMnv/diSFsWh72PJG2kjft6sw4RQyt2dVDaopKpRi3ky0pXoRbpUdwYLl3b\n" +
              "QGxUetldAA0qUiyYidCFP8gZ8JJmzlciQgzDBLJYXDAz/gtoG02AUOChNgT/NGdQ\n" +
              "nmvZ9oRHN/DdEXrDfX/SFQKBgHnF/Zqy2qnAgoa1Yb4SQmOQBZ/P/udYzWHJoW+d\n" +
              "++KIIzxGqT/K8TgbmxpYa3g7n8r/UMpBQVmiJX3jpb1yDF4K/aLE/F1nPCEBrmlG\n" +
              "J0gnc6X/KQOPsxPjiZkYIUtrOKzOKdlBeR1O1ue36mBkjMR8VnU+pswdPkSfcg/M\n" +
              "2DG/AoGBAJbBeDuF+9Jj9sd2mlErAkB9cwBubjf7jm6wUgfN2Tb9yjDl7sPjmD+F\n" +
              "6aBIT5RM5TkOziAAl4h4w5gsNbi4UQLmasjI4wpXlywLMbmg8wezYnPPfXBc7BqI\n" +
              "Y0lle478yG6AUfSl9PlSPvpvs9q0x0Gc9yn1/A0Jl9c+t4fRGzvu\n" +
              "-----END RSA PRIVATE KEY-----");

          const decrypted = privateKey.decrypt(encrypt);
          console.log("decrypted:" + decrypted);

        });
  }
}
