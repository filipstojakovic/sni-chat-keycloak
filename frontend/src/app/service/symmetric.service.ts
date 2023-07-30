import {Injectable} from '@angular/core';
import forge from 'node-forge';
import {UtilService} from './util.service';

@Injectable({
  providedIn: 'root',
})
export class SymmetricService {

  constructor(private util: UtilService) {
  }

  generateSymmetricKey() {
    const key = forge.random.getBytesSync(16);
    const iv = forge.random.getBytesSync(8);
    return { key, iv };
  }

  encryptMessage(message: string, key: string) {

    const cipher = forge.cipher.createCipher('AES-ECB', key);
    cipher.start();
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    const encryptedMessage = cipher.output.getBytes();

    return forge.util.bytesToHex(encryptedMessage);
  }

  decryptMessage(encryptedMessageHex:string, key:string){

    const decipher = forge.cipher.createDecipher('AES-ECB', key);
    const encryptedBuffer = forge.util.hexToBytes(encryptedMessageHex);
    decipher.start();
    decipher.update(forge.util.createBuffer(encryptedBuffer));
    decipher.finish();

    return decipher.output.toString();
  }

  testSymmetricEncryption(){

    const message = "secret message";
    const { key } = this.generateSymmetricKey();
    const encrypt = this.encryptMessage(message,key);
    console.log("symmetric.service.ts > symmetricEncryption(): "+ encrypt);

    const decrypt = this.decryptMessage(encrypt,key);
    console.log("symmetric.service.ts > symmetricEncryption(): "+ decrypt);
  }

}
