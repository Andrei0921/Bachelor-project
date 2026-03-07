import { Component } from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar';
import {RouterOutlet} from '@angular/router';

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
}
