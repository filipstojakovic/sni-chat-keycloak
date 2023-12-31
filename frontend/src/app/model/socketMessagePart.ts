export class SocketMessagePart {

  id: string;
  senderName: string = "";
  receiverName: string = "";
  messagePart: string = "";

  partNumber: any;
  totalParts: number;
  port: number;

  constructor(id: string, messagePart: string, senderUsername: string, receiverUsername: string, partNumber: any, totalParts: number) {
    this.id = id;
    this.messagePart = messagePart;
    this.senderName = senderUsername;
    this.receiverName = receiverUsername;
    this.partNumber = partNumber;
    this.totalParts = totalParts;
  }
}
