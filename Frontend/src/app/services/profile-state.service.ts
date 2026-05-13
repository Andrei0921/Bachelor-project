import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import {UserControllerService, UserDTO} from '../api';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  private readonly currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly userApi: UserControllerService,
    private readonly tokenService: TokenService,
  ) {}

  loadCurrentUser(): Observable<UserDTO> {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      return throwError(() => new Error('Missing user id'));
    }

    return this.userApi.getUser(userId).pipe(
      tap((user) => this.currentUserSubject.next(user)),
    );
  }

  setCurrentUser(user: UserDTO | null): void {
    this.currentUserSubject.next(user);
  }

  clear(): void {
    this.currentUserSubject.next(null);
  }

  getFallbackDisplayName(): string {
    return this.tokenService.getDisplayNameFromToken();
  }
}
