import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StompService {

  private stompClientMap = new Map<number, Stomp.Client>();

  constructor(private auth: AuthService) {
  }

  connect(port: number = 8080) {
    const token = this.auth.getToken();
    let url = `https://localhost:${port}/api/ws?token=${token}`;

    const socket = new SockJS(url);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null //TODO: disable logs
    this.stompClientMap.set(port, stompClient);
  }

  subscribe(port: number, topic: string, callback: any): void {
    const stompClient = this.stompClientMap.get(port);
    const connected: boolean = stompClient.connected;
    if (connected) {
      console.warn("ALREADY CONNECTED");
      this.subscribeToTopic(port, topic, callback);
      return;
    }
    // if stomp client is not connected
    stompClient.connect({
      "X-Authorization": this.auth.getToken(),
    }, (): any => {
      this.subscribeToTopic(port, topic, callback);
    })
  }

  sendMessage(port: number, to: string, chatMessage: string) {
    const stompClient = this.stompClientMap.get(port);
    stompClient.send(to, {}, chatMessage);
  }

  private subscribeToTopic(port: number, topic: string, callback: any) {
    const stompClient = this.stompClientMap.get(port);
    stompClient.subscribe(topic, (payload): any => {
      callback(payload); // maybe call callback(payload.body);
    })
  }

}
