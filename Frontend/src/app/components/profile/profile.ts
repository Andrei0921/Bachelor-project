import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {UserControllerService, UserDTO} from '../../api';
import {ToastService} from '../../services/toast.service';
import {TokenService} from '../../services/token.service';
import {ProfileStateService} from '../../services/profile-state.service';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    Button,
    InputTextModule,
    PrimeTemplate,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  user: UserDTO | null = null;
  isLoading = false;
  isSavingProfile = false;
  isSavingPassword = false;
  isDeleting = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private readonly userApi: UserControllerService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly tokenService: TokenService,
    private readonly router: Router,
    private readonly profileState: ProfileStateService,
    private readonly confirmationService: ConfirmationService,
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

    if (!this.user?.id) {
      this.toastService.error('Nu am putut identifica utilizatorul.');
      this.isSavingProfile = false;
      return;
    }

    this.userApi.updateUser(this.user.id, {
      ...this.user,
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

    if (!this.user?.id) {
      this.toastService.error('Nu am putut identifica utilizatorul.');
      this.isSavingPassword = false;
      return;
    }

    this.userApi.updateUser(this.user.id, {
      ...this.user,
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
    this.confirmationService.confirm({
      header: 'Sterge contul',
      message: 'Esti sigur ca vrei sa stergi contul? Aceasta actiune nu poate fi anulata.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sterge',
      rejectLabel: 'Anuleaza',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.confirmDeleteAccount(),
    });
  }

  private confirmDeleteAccount(): void {
    this.isDeleting = true;

    if (!this.user?.id) {
      this.toastService.error('Nu am putut identifica utilizatorul.');
      this.isDeleting = false;
      return;
    }

    this.userApi._delete(this.user.id).subscribe({
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
