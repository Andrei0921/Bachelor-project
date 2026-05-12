import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {UserDTO} from '../../api';
import {ToastService} from '../../services/toast.service';
import {TokenService} from '../../services/token.service';
import {ProfileStateService} from '../../services/profile-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    Button,
    InputTextModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  user: UserDTO | null = null;
  isLoading = false;
  isSavingProfile = false;
  isSavingPassword = false;
  isDeleting = false;

  profileForm: any;
  passwordForm: any;

  constructor(
    private readonly http: HttpClient,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly tokenService: TokenService,
    private readonly router: Router,
    private readonly profileState: ProfileStateService,
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    this.profileState.loadCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({name: user.name ?? ''});
      },
      error: () => {
        this.toastService.error('Nu am putut incarca profilul.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    this.isSavingProfile = true;

    this.http.put<UserDTO>('/api/users/me', {
      name: this.profileForm.value.name,
    }).subscribe({
      next: (user) => {
        this.user = user;
        this.profileState.setCurrentUser(user);
        this.profileForm.patchValue({name: user.name ?? ''});
        this.toastService.success('Profilul a fost actualizat.');
      },
      error: () => {
        this.toastService.error('Nu am putut actualiza profilul.');
      },
      complete: () => {
        this.isSavingProfile = false;
      },
    });
  }

  changePassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) return;

    const raw = this.passwordForm.value;
    if (raw.password !== raw.confirmPassword) {
      this.toastService.warning('Parolele nu coincid.');
      return;
    }

    this.isSavingPassword = true;

    this.http.put<UserDTO>('/api/users/me/password', {
      currentPassword: raw.currentPassword,
      password: raw.password,
    }).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.toastService.success('Parola a fost schimbata.');
      },
      error: () => {
        this.toastService.error('Nu am putut schimba parola.');
      },
      complete: () => {
        this.isSavingPassword = false;
      },
    });
  }

  deleteAccount(): void {
    if (!confirm('Sigur vrei sa stergi contul? Actiunea nu poate fi anulata.')) return;

    this.isDeleting = true;

    this.http.delete<void>('/api/users/me').subscribe({
      next: () => {
        this.tokenService.clear();
        this.profileState.clear();
        this.toastService.success('Contul a fost sters.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.error('Nu am putut sterge contul.');
        this.isDeleting = false;
      },
    });
  }
}
