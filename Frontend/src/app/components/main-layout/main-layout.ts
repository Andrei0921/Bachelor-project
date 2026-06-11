import { Component } from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar';
import {RouterOutlet} from '@angular/router';
import {ContentWebSocketService} from '../../services/content-websocket.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  sidebarCollapsed = false;

  constructor(private readonly contentWebSocket: ContentWebSocketService) {
    this.contentWebSocket.connect();
  }
}
