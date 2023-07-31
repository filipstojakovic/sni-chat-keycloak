export class ChatMessage {

  id: string;
  senderName: string = "";
  receiverName: string = "";
  message: string = "";

  constructor(id: string, senderName: string, receiverName: string, message: string) {
    this.id = id;
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.message = message;
  }
}
