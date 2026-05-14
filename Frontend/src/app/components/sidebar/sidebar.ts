import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuService} from '../../services/menu.service';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {filter} from 'rxjs';
import {TokenService} from '../../services/token.service';
import {UserControllerService} from '../../api';
import {ProfileStateService} from '../../services/profile-state.service';
import {Subscription} from 'rxjs';

type SidebarMode = 'user' | 'admin';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, Tooltip, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnDestroy {
  @Output() menuSelect = new EventEmitter<string>();
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() mode: SidebarMode = 'user';
  collapsed = false;
  currentUserName = '';
  private readonly subscriptions = new Subscription();

  userMenuItems = [
    {label: 'Acasa', icon: 'pi pi-home', route: '/home', active: false},
    {label: 'Lecții', icon: 'pi pi-graduation-cap', route: '/lesson', active: false},
    {label: 'Quiz-uri', icon: 'pi pi-pen-to-square', route: '/quiz', active: false},
    {label: 'Model 3D', icon: 'pi pi-slack', route: '/model', active: false},
    {label: 'Profil', icon: 'pi pi-user', route: '/profile', active: false},
    {label: 'Log Out', icon: 'pi pi-sign-out', route: '', active: false}
  ];

  adminMenuItems = [
    {label: 'Quiz-uri', icon: 'pi pi-pen-to-square', route: '/admin/quiz',active: false},
    {label: 'Lecții', icon: 'pi pi-book', route: '/admin/lesson',active: false},
    {label: 'Log Out', icon: 'pi pi-sign-out', route: '',active: false}
  ];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private tokenService: TokenService,
    private userApi: UserControllerService,
    private profileState: ProfileStateService,
  ) {
    this.syncModeFromRoute(this.router.url);
    this.subscriptions.add(
      this.profileState.currentUser$.subscribe((user) => {
        this.currentUserName = user?.name?.trim() || '';
      })
    );
    this.loadCurrentUserName();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncModeFromRoute(event.urlAfterRedirects || event.url);
        this.loadCurrentUserName();
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get menuItems() {
    return this.mode === 'admin' ? this.adminMenuItems : this.userMenuItems;
  }

  get brandTitle() {
    return this.mode === 'admin' ? 'Admin' : this.currentUserName || this.tokenService.getDisplayNameFromToken() || 'User';
  }


  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onSelect(item: { label: string; route: string }) {
    this.menuSelect.emit(item.label);

    if (!item.route) {
      this.menuService.navigate(item.label);
      return;
    }

    this.router.navigate([item.route]);
  }

  private syncModeFromRoute(url: string) {
    this.mode = url.startsWith('/admin') ? 'admin' : 'user';
  }

  private loadCurrentUserName(): void {
    if (!this.tokenService.getToken()) {
      this.currentUserName = '';
      return;
    }

    const userId = this.tokenService.getUserId();
    if (!userId) {
      this.currentUserName = '';
      return;
    }

    this.userApi.getUser(userId).subscribe({
      next: (user) => {
        this.profileState.setCurrentUser(user);
      },
      error: () => {
        this.currentUserName = '';
      },
    });
  }
}
