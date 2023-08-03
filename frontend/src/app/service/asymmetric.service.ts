import {Injectable} from '@angular/core';
import forge from 'node-forge';
import {HttpClient} from '@angular/common/http';
import {UtilService} from './util.service';
import UserCert from '../model/userCert';

@Injectable({
  providedIn: 'root',
})
export class AsymmetricService {

  userCertMap: Map<string, UserCert>

  constructor(private http: HttpClient, private util: UtilService) {
    this.userCertMap = new Map<string, UserCert>();
  }

  async loadCerts() {
    const testCertPromise = this.http.get('assets/user_certs/test.crt', { responseType: 'text' }).toPromise();
    const testKeyPromise = this.http.get('assets/user_certs/test.key', { responseType: 'text' }).toPromise();
    const userCertPromise = this.http.get('assets/user_certs/user.crt', { responseType: 'text' }).toPromise();
    const userKeyPromise = this.http.get('assets/user_certs/user.key', { responseType: 'text' }).toPromise();
    const user1CertPromise = this.http.get('assets/user_certs/user1.crt', { responseType: 'text' }).toPromise();
    const user1KeyPromise = this.http.get('assets/user_certs/user1.key', { responseType: 'text' }).toPromise();
    const user2CertPromise = this.http.get('assets/user_certs/user2.crt', { responseType: 'text' }).toPromise();
    const user2KeyPromise = this.http.get('assets/user_certs/user2.key', { responseType: 'text' }).toPromise();
    const [testCert, testKey, userCert, userKey, user1Cert, user1Key, user2Cert, user2Key] = await Promise.all(
      [
        testCertPromise,
        testKeyPromise,
        userCertPromise,
        userKeyPromise,
        user1CertPromise,
        user1KeyPromise,
        user2CertPromise,
        user2KeyPromise]);
    this.userCertMap.set("test", new UserCert(testCert, testKey));
    this.userCertMap.set("user", new UserCert(userCert, userKey));
    this.userCertMap.set("user", new UserCert(userCert, userKey));
    this.userCertMap.set("user1", new UserCert(user1Cert, user1Key));
    this.userCertMap.set("user2", new UserCert(user2Cert, user2Key));
  }

  //return base64
  encryptWithUserPublicKey(message: string, user: string) {
    const { cert } = this.userCertMap.get(user);
    const publicKey = cert.publicKey as forge.pki.rsa.PublicKey
    return this.encryptWithPublicKey(message, publicKey);
  }

  //return base64
  encryptWithPublicKey(message: string, publicKey: forge.pki.rsa.PublicKey) {
    const encrypt = publicKey.encrypt(message);
    return this.util.stringToBase64(encrypt);
  }

  // insert base64
  decryptWithPrivateKey(encryptedBase64: string, user: string) {
    const { privateKey } = this.userCertMap.get(user);
    const encryptedMessage = this.util.base64ToString(encryptedBase64);
    return privateKey.decrypt(encryptedMessage);
  }

  //normal message
  signMessage(message: string, user: string) {
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const { privateKey } = this.userCertMap.get(user);
    const signature = privateKey.sign(md);

    return this.util.stringToBase64(signature);
  }

  verifyMessage(message: string, signatureBase64: string, user: string) {
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const { cert } = this.userCertMap.get(user);
    const publicKey = cert.publicKey as forge.pki.rsa.PublicKey
    const signature = this.util.base64ToString(signatureBase64);
    const verified = publicKey.verify(md.digest().bytes(), signature);

    return verified;
  }

  test(messageIsSecret: string) {
    const message = "secure 100%";
    const signature = this.signMessage(message, "user");

    console.log(signature);

    const verify = this.verifyMessage(message, signature, "user");
    console.log("asymmetric.service.ts > verify: " + verify);
  }

  test2(messageIsSecret: string) {
    const encrypt = this.encryptWithUserPublicKey(messageIsSecret, "user");
    console.log(encrypt);
    const decrypt = this.decryptWithPrivateKey(encrypt, "user");
    console.log("asymmetric.service.ts > decrypted(): " + decrypt);
  }

}
