import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuService} from '../../services/menu.service';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {filter} from 'rxjs';
import {TokenService} from '../../services/token.service';

type SidebarMode = 'user' | 'admin';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, Tooltip, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Output() menuSelect = new EventEmitter<string>();
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() mode: SidebarMode = 'user';
  collapsed = false;

  userMenuItems = [
    {label: 'Home', icon: 'pi pi-home', route: '/home', active: false},
    {label: 'Lessons', icon: 'pi pi-graduation-cap', route: '/lesson', active: false},
    {label: 'Quizzes', icon: 'pi pi-pen-to-square', route: '/quiz', active: false},
    {label: '3d Model', icon: 'pi pi-slack', route: '/model', active: false},
    {label: 'Log out', icon: 'pi pi-sign-out', route: '', active: false}
  ];

  adminMenuItems = [
    {label: 'Quiz-uri', icon: 'pi pi-pen-to-square', route: '/admin/quiz',active: false},
    {label: 'Lecții', icon: 'pi pi-book', route: '/admin/lesson',active: false},
    {label: 'Log out', icon: 'pi pi-sign-out', route: '',active: false}
  ];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.syncModeFromRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncModeFromRoute(event.urlAfterRedirects || event.url);
      });
  }

  get menuItems() {
    return this.mode === 'admin' ? this.adminMenuItems : this.userMenuItems;
  }

  get brandTitle() {
    return this.mode === 'admin' ? 'Admin' : this.tokenService.getDisplayNameFromToken() || 'User';
  }


  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onSelect(item: { label: string; route: string }) {
    this.menuSelect.emit(item.label);
    this.menuService.navigate(item.label);
  }

  private syncModeFromRoute(url: string) {
    this.mode = url.startsWith('/admin') ? 'admin' : 'user';
  }
}
