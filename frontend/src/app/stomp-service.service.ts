import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StompServiceService {

  private readonly socket;
  private stompClient;

  constructor(private auth: AuthService) {

    this.socket = new SockJS("https://localhost:8080/api/ws");
    this.stompClient = Stomp.over(this.socket);
    // this.stompClient.debug = null //TODO: disable logs
  }

  subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if (connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }
    console.log("subscribe(): " + "**** NOT CONNECTED ****");

    // if stomp client is not connected
    this.stompClient.connect({}, (): any => {
      this.subscribeToTopic(topic, callback);
    })
  }

  private subscribeToTopic(topic: string, callback: any) {
    this.stompClient.subscribe(topic, (payload): any => {
      callback(payload);
    })
  }

  sendMessage(to: string, chatMessage: string) {
    this.stompClient.send(to, {}, chatMessage);
  }

  connect() {
    this.stompClient.connect("", (): any => {
      console.log("stomp-service.service.ts > connect(): " + "empty connect");
    })
  }
}
