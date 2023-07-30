import forge from "node-forge";

export default class UserCert {

  cert: forge.pki.Certificate;
  privateKey: forge.pki.rsa.PrivateKey;

  constructor(cert: string, privateKey: string) {
    this.cert = forge.pki.certificateFromPem(cert);
    this.privateKey = forge.pki.privateKeyFromPem(privateKey);
  }
}
