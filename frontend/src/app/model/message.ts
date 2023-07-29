export class Message {
  message: string = "test content";
  senderName: string = "";
  receiverName: string = "";
  timestamp = Date.now();


  constructor(message: string, senderUsername: string, receiverUsername: string) {
    this.message = message;
    this.senderName = senderUsername;
    this.receiverName = receiverUsername;
    this.timestamp = Date.now();
  }
}
