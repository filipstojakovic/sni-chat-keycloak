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
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64): ArrayBuffer {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
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

  generateSymmetricKey() {
    const key = forge.random.getBytesSync(16);
    const iv = forge.random.getBytesSync(8);
    return {key, iv};
  }

  imageEncrypt() {
    this.http.get('assets/png.png', {responseType: 'arraybuffer'}).subscribe({
        next: (res) => {

          const message = 'keep it secret, keep it safe' // string or buffer
          const stege = new Steganography();

          const image = stege.hideMessage(res, message);
          // const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
          const base64String = this.arrayBufferToBase64(image);
          console.log(image);

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

  symmetricEncryption() {

    const message = "secret message";
    const {key} = this.generateSymmetricKey();
    const cipher = forge.cipher.createCipher('AES-ECB', key);
    cipher.start();
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    const encryptedMessage = cipher.output.getBytes();
    const encryptedMessageHex = forge.util.bytesToHex(encryptedMessage);

    console.log("crypto.service.ts > encryptedMessage(): " + encryptedMessage);
    console.log("crypto.service.ts > encryptedMessageHex(): " + encryptedMessageHex);

    const decipher = forge.cipher.createDecipher('AES-ECB', key);
    const encryptedBuffer = forge.util.hexToBytes(encryptedMessageHex);
    decipher.start();
    decipher.update(forge.util.createBuffer(encryptedBuffer));
    decipher.finish();

    const newMessage = decipher.output.toString();
    console.log("crypto.service.ts > newMessage(): " + newMessage);
  }

  withoutHeaderPrivateKey() {

    this.http.get('assets/cert.key', {responseType: 'text'}).subscribe({
        next: (res) => {

          const secretMessage = "tajna poruka";

          const strippedPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkg/sPwkCE5RDzCShLHii\n" +
            "+G24YO84rY5/Sg8Ei8gIND8RL8kjPmu9zf572H75JSbSVV9UNSB3tDL6T+ZF77pJ\n" +
            "Y2IEb4TylpmOUvf4oKzs58y8WPZ1dqnDvOQbqFdvnrWBq+MbqaGxRUI/5ZNJugQT\n" +
            "R4tqsiFAoUVEsnnmA0XDj369XGacDTY7rIYO7+2BiTgUB2nJsP+9WnfpP0qIOjgn\n" +
            "KnidX/eEr4hmKQERGqJRY0VjGSb6dV2gWtJMwVyBX2pqgWeiHqKAvhBqsg9fh7fc\n" +
            "w5EYpa7FI9q9zVsECtl/OaMvTz57OQC9v2iwAXV+67/6PNEAASEiJRXo+kKGQW7W\n" +
            "owIDAQAB";

          const binaryPublicKey = forge.util.decode64(strippedPublicKey);
          const ans1PubKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(binaryPublicKey));
          const rsaPubKey = ans1PubKey as forge.pki.rsa.PublicKey; // mora ovo "AS"

          const encrypt = rsaPubKey.encrypt(secretMessage);
          const base64 = this.encodeBase64(encrypt);

          console.log("encrypt: " + base64);


          const strippedPrivateKey = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSD+w/CQITlEPM\n" +
            "JKEseKL4bbhg7zitjn9KDwSLyAg0PxEvySM+a73N/nvYfvklJtJVX1Q1IHe0MvpP\n" +
            "5kXvukljYgRvhPKWmY5S9/igrOznzLxY9nV2qcO85BuoV2+etYGr4xupobFFQj/l\n" +
            "k0m6BBNHi2qyIUChRUSyeeYDRcOPfr1cZpwNNjushg7v7YGJOBQHacmw/71ad+k/\n" +
            "Sog6OCcqeJ1f94SviGYpAREaolFjRWMZJvp1XaBa0kzBXIFfamqBZ6IeooC+EGqy\n" +
            "D1+Ht9zDkRilrsUj2r3NWwQK2X85oy9PPns5AL2/aLABdX7rv/o80QABISIlFej6\n" +
            "QoZBbtajAgMBAAECggEAOsJ3GyDHmhLSd4Tg5iAeB+0z+KMkXQXvhV6nSIiPbF1W\n" +
            "z6+OIyV69S0Eq6LhHiYRBdFU8g5+uZqsgooz5m496eJbwHVullFuJUim2BTZNaNy\n" +
            "viNgO/2txgbKbZ3HRMTmRr0VutdWlnNBe10WkuPi0axvnvuroXVZXqeVdgmR097g\n" +
            "P2XP/PtV7mPXBqVfPtKu/gnhDsoqpfdNVeL9HFw6uYdThmfS+e5ZXBZcdKDuR1c7\n" +
            "PfTHO7UOJ3OsbhwBMMlg3Bv/mPogelDnQW2egahfshXpINxQ4caJzV+IJsku/ViD\n" +
            "siXEqBnkqlfVWcO0dNkadHVm3hnRx9cxbsOPctLfEQKBgQDBiM5CuiVPFSV++BuY\n" +
            "RLcPQBzJFzqdyA+qGlMmSacFiTZ3Ud8+sjXUUFAa+RkZXbifjblg+7CXnBicmW6E\n" +
            "MY21GyBXnbfD304NkeIsUP7A1iRw5/0PGVP+UZSYaRA1kDQOx8hh7JZr8ApOQIxw\n" +
            "QXzY0uhl18DC7wdUmBM7OxK/CQKBgQDBNJ//HMF9InuNPB/1wKebfNjSuZFMMnIA\n" +
            "iw/rXBclUm7zCE3qpEe2FsxRiiBuXXK3ZVOVwuyWIAeDfiiVwH6iI+JKxpP51X4K\n" +
            "LlWw08pomgLQ3UkjetiCSv1VjvSk9Vc7EcYFvoAoxiE492bHNvZNpXNkOnCPM1Qo\n" +
            "XyVHuEKnSwKBgQCRosY8NmG++hXGTyRM2GC9DCzdMiq88wC+q6KorEIQi2m+LpEF\n" +
            "WAvj4i/1rD+z8+/ruTWoAp6n6CIpLdiZh8SwZWJYLGpN7muJEJ+XY7fhGwQ/JoQq\n" +
            "6Y9oULG2Y1F8TTCvcq2a6vNi9DZ9HlvQWad+bm/Nu6blygPFJ89JAjIgKQKBgE+D\n" +
            "tQVtdERn2Kl7wTuHGnPnoeS38pCFgl2u3dJjiDMYBgmHtWmISusp3tUAH/DMDNZl\n" +
            "oUzVeEEg1XbMiS94laVtV0inCWec8c6G20V3JKqAGACV0fAEMu8Mpc58kzsArfHl\n" +
            "krXyfRRK1ol3aJk8iYnTOfZaBtEoss4aumEV+HiZAoGAWy1ffZ0fkYlZhrGNTaK9\n" +
            "9ZhhWRGAvmuBTiVzqwLEoCt8weMao7Omob352c8V3ONSbKHnqv6IjhqREETuVnmW\n" +
            "U9gDtum9eZP9G068QAg23EF/U/xllJNrb1Yvhanl35+X5YQJJmdoz02Vkocjfmp6\n" +
            "NdIBqnROk1DhY/osTywSq/A="

          const binaryPrivateKey = forge.util.decode64(strippedPrivateKey);
          const privateKey = forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(binaryPrivateKey)) as forge.pki.rsa.PrivateKey;
          //
          const decrypted = privateKey.decrypt(encrypt);
          console.log("decrypted:" + decrypted);

        },
        error: (err) => {
          console.error(err.message);
        },
      },
    );
  }

  exportKey() {
    this.http.get('assets/cert.key', {responseType: 'text'})
      .subscribe(data => {

        const ed25519 = forge.pki.ed25519;

        const pubKey = forge.pki.publicKeyFromPem(
          "-----BEGIN PUBLIC KEY-----\n" +
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


        const privateKey = forge.pki.privateKeyFromPem(
          "-----BEGIN RSA PRIVATE KEY-----\n" +
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
