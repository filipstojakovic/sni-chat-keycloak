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
    // const symmetricKey:string = forge.random.getBytesSync(16).toString();
    const symmetricKey:string = this.util.generateRandomString(16);
    const iv = forge.random.getBytesSync(8);
    return { symmetricKey, iv };
  }

  encryptMessage(message: string, symmetricKey: string) {

    const cipher = forge.cipher.createCipher('AES-ECB', symmetricKey);
    cipher.start();
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    const encryptedMessage = cipher.output.getBytes();

    return forge.util.bytesToHex(encryptedMessage);
  }

  decryptMessage(encryptedMessageHex: string, key: string) {

    const decipher = forge.cipher.createDecipher('AES-ECB', key);
    const encryptedBuffer = forge.util.hexToBytes(encryptedMessageHex);
    decipher.start();
    decipher.update(forge.util.createBuffer(encryptedBuffer));
    decipher.finish();

    return decipher.output.toString();
  }

  testSymmetricEncryption() {

    const message = "secret message";
    const { symmetricKey } = this.generateSymmetricKey();
    const encrypt = this.encryptMessage(message, symmetricKey);
    console.log("symmetric.service.ts > symmetricEncryption(): " + encrypt);

    const decrypt = this.decryptMessage(encrypt, symmetricKey);
    console.log("symmetric.service.ts > symmetricEncryption(): " + decrypt);
  }

}
