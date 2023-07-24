export default class Steganography {

  hideMessage(image: ArrayBuffer, message: string): ArrayBuffer {
    const messageBytes = new TextEncoder().encode(message);
    const messageLength = messageBytes.length;

    // Add the message length as the first 4 bytes (32 bits) in the image
    const lengthBytes = this.intToBytes(messageLength);
    const imageArray = new Uint8Array(image);
    imageArray.set(lengthBytes, 0);

    // Embed each byte of the message into the image
    let imageOffset = 4; // Skip the first 4 bytes reserved for message length
    for (let i = 0; i < messageLength; i++) {
      const b = messageBytes[i];
      for (let j = 0; j < 8; j++) {
        const bit = (b >> (7 - j)) & 1; // Extract each bit of the byte
        imageArray[imageOffset] = (imageArray[imageOffset] & 0xfe) | bit; // Embed the bit in the image
        imageOffset++;
      }
    }
    return image;
  }

  // Retrieve the message from the image
  retrieveMessage(image: ArrayBuffer): string {
    const imageArray = new Uint8Array(image);
    const lengthBytes = imageArray.slice(0, 4);
    const messageLength = this.bytesToInt(lengthBytes);

    const messageBytes = new Uint8Array(messageLength);
    let imageOffset = 4; // Skip the first 4 bytes reserved for message length
    for (let i = 0; i < messageLength; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) {
        const bit = imageArray[imageOffset] & 1; // Extract the embedded bit from the image
        b = (b << 1) | bit; // Append the bit to the byte
        imageOffset++;
      }
      messageBytes[i] = b;
    }
    return new TextDecoder().decode(messageBytes);
  }

  // Helper methods to convert int to bytes and vice versa
  intToBytes(value: number): Uint8Array {
    const bytes = new Uint8Array(4);
    bytes[0] = (value >> 24) & 0xff;
    bytes[1] = (value >> 16) & 0xff;
    bytes[2] = (value >> 8) & 0xff;
    bytes[3] = value & 0xff;
    return bytes;
  }

  bytesToInt(bytes: Uint8Array): number {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }
}
