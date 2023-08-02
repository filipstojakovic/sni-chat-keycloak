import {Injectable} from '@angular/core';
import forge from 'node-forge';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor() {
  }

  stringToBase64(text: string) {
    return forge.util.encode64(text)
  }

  base64ToString(base64: string) {
    return forge.util.decode64(base64);
  }

  divideStringRandomly(inputString: string): string[] {
    const length = inputString.length;
    const numberOfParts = Math.floor(Math.random() * (length - 2)) + 3; // Random number of parts from 3 to length

    const partLength = Math.ceil(length / numberOfParts);
    const dividedString: string[] = [];

    for (let i = 0; i < length; i += partLength) {
      dividedString.push(inputString.slice(i, i + partLength));
    }

    return dividedString;
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

}
