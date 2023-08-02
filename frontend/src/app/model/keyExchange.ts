export class KeyExchange {

  encryptedSymmetricKeyBase64: string = "";
  signatureBase64: string = "";

  constructor(encryptedSymmetricKeyBase64: string, signatureBase64: string) {
    this.encryptedSymmetricKeyBase64 = encryptedSymmetricKeyBase64;
    this.signatureBase64 = signatureBase64;
  }
}
