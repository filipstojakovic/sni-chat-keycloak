import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {environment} from '../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  static readonly SOCKET_CONNECTED: number = 1;
  ws: WebSocket;

  constructor(private auth: AuthService) {
  }

  connect(): Observable<string> {
    const token = this.auth.getToken();
    let url = `wss://localhost:${environment.socketServerPort}/ws?token=${token}`;
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
      return () => this.ws.close(1000, "User disconnected");
    })
  }

  sendMessage(port: number, chatMessage: string) {
    if (this.ws.readyState === SocketService.SOCKET_CONNECTED) {
      const tmp = JSON.parse(chatMessage);
      tmp.port = port;
      this.ws.send(JSON.stringify(tmp));
    } else {
      console.log("socket.service.ts > sendMessage(): " + "socket not connected");
    }
  }

}
