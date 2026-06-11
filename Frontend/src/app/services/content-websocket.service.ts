import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface ContentEvent {
  resource: 'LESSON' | 'QUIZ';
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  id: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContentWebSocketService {
  private readonly eventSubject = new ReplaySubject<ContentEvent>(20);
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  readonly events$ = this.eventSubject.asObservable();

  constructor(private zone: NgZone) {
  }

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN ||
        this.socket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.socket = new WebSocket(this.getWebSocketUrl());

    this.socket.onopen = () => {
      console.info('WebSocket conectat.');
    };

    this.socket.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as ContentEvent;
        console.info('Eveniment WebSocket primit:', event);
        this.zone.run(() => this.eventSubject.next(event));
      } catch (error) {
        console.warn('Eveniment WebSocket invalid primit de la server.', message.data, error);
      }
    };

    this.socket.onclose = () => {
      console.warn('WebSocket deconectat. Reconectare in 3 secunde.');
      this.socket = null;
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('Conexiunea WebSocket a esuat.', error);
      this.socket?.close();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    if (window.location.port === '4200') {
      return `${protocol}//${window.location.hostname}:8080/ws`;
    }

    return `${protocol}//${window.location.host}/ws`;
  }
}
