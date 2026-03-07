import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuService} from '../../services/menu.service';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, Tooltip],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Output() menuSelect = new EventEmitter<string>();
  @Output() collapsedChange = new EventEmitter<boolean>();

  collapsed = false;

  menuItems = [
    {label: 'Home', icon: 'pi pi-home', route: '/home', active: false},
    {label: 'User', icon: 'pi pi-user', route: '/user', active: false},
    {label: 'Lessons', icon: 'pi pi-graduation-cap', route: '/lesson', active: false},
    {label: 'Quizzes', icon: 'pi pi-pen-to-square', route: '/quiz', active: false},
    {label: '3d Model', icon: 'pi pi-slack', route: '/model', active: false},
    {label: 'Log out', icon: 'pi pi-sign-out', route: '', active: false}
  ];

  constructor(private menuService: MenuService) {
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onSelect(item: any) {
    this.menuItems.forEach(i => (i.active = false));
    item.active = true;
    this.menuSelect.emit(item.label);
    this.menuService.navigate(item.label);
  }
}
