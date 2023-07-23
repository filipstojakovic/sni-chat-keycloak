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

    const token = auth.getToken();
    let url = `https://localhost:8080/api/ws?token=${token}`;
    // const websocket = new WebSocket(url);
    this.socket = new SockJS(url);
    this.stompClient = Stomp.over(this.socket);
    // this.stompClient.debug = null //TODO: disable logs
  }

  subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if (connected) {
      console.warn("ALREADY CONNECTED");
      this.subscribeToTopic(topic, callback);
      return;
    }
    // if stomp client is not connected
    this.stompClient.connect({
      "X-Authorization": this.auth.getToken()
    }, (): any => {
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
