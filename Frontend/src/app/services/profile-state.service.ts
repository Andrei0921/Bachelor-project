import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserDTO} from '../api';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  private readonly currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
  ) {}

  loadCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>('/api/users/me').pipe(
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
