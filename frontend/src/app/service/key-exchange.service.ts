import {Injectable} from '@angular/core';
import forge from 'node-forge';
import {KeyExchange} from '../model/keyExchange';
import {HttpClient} from '@angular/common/http';
import {SymmetricService} from './symmetric.service';
import {AsymmetricService} from './asymmetric.service';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class KeyExchangeService {

  private sessionKeys = new Map<number, string>(); //  port, session key

  constructor(private http: HttpClient,
              private symmetric: SymmetricService,
              private asymmetric: AsymmetricService,
              private auth: AuthService,
  ) {
  }

  async exchangeKeysWithServer(port: number) {

    const rootCertString = await this.http.get('assets/user_certs/rootCA.crt', { responseType: 'text' }).toPromise();
    const rootCert = forge.pki.certificateFromPem(rootCertString);
    const rootPubKey = rootCert.publicKey as forge.pki.rsa.PublicKey;

    const { symmetricKey } = this.symmetric.generateSymmetricKey();
    // const symmetricKey = "secretKey";
    console.log("message.service.ts > exchangeKeysWithServer(): " + symmetricKey);
    const encryptedSymmetricKeyBase64 = this.asymmetric.encryptWithPublicKey(symmetricKey, rootPubKey);
    const signatureBase64 = this.asymmetric.signMessage(symmetricKey, this.auth.getUsername());

    const whichApi = port % 10;
    const url = `/api${whichApi}/key-exchange`;
    this.http.post(url, new KeyExchange(encryptedSymmetricKeyBase64, signatureBase64)).subscribe({
        next: (res) => {
          this.sessionKeys.set(port, symmetricKey);
        },
        error: (err) => {
          console.error(err.message);
        },
      },
    );
  }

  getSessionKey(port:number){
    return this.sessionKeys.get(port);
  }
}
