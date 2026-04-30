import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import {SidebarComponent} from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;
}
