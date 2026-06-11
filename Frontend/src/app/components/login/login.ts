
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthControllerService, AuthResponse } from '../../api';
import { TokenService } from '../../services/token.service';
import { FormService } from '../../services/form.service';
import { HttpResponseService } from '../../services/http-response.service';
import {ToastService} from '../../services/toast.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ],
})
export class LoginComponent {
  email = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    private authController: AuthControllerService,
    private tokenService: TokenService,
    private router: Router,
    private formUtils: FormService,
    private httpResponseService: HttpResponseService,
    private toastService: ToastService,
  ) {
  }

  onSubmit(): void {
    const validation = this.formUtils.validateLoginForm(this.email, this.password);
    if (!validation.isValid) {
      this.errorMessage = Object.values(validation.errors)[0];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = { email: this.email.trim(), password: this.password };

    this.authController.login(credentials).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      },
    });
  }


  private async handleLoginSuccess(response: AuthResponse | Blob): Promise<void> {
    this.isLoading = false;
    this.errorMessage = '';

    try {
      let parsedResponse: AuthResponse;
      if (response instanceof Blob) {
        const text = await response.text();
        parsedResponse = this.parseAuthResponse(JSON.parse(text) as unknown);
      } else {
        parsedResponse = response;
      }
      const token = parsedResponse.token;
      const userId = parsedResponse.userId;

      if (token) {
        this.tokenService.setToken(token);
        this.tokenService.setUserId(userId);
        const isAdmin = this.isAdminFromToken(token);
        await this.router.navigate([isAdmin ? '/admin/quiz' : '/home']);
      } else {
        this.errorMessage = 'No authentication token received';
        this.toastService.error(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = 'Failed to process login response';
      this.toastService.error(this.errorMessage);
    }
  }

  private parseAuthResponse(value: unknown): AuthResponse {
    if (typeof value !== 'object' || value === null) {
      return {};
    }

    const response = value as Record<string, unknown>;
    return {
      token: typeof response['token'] === 'string' ? response['token'] : undefined,
      userId: typeof response['userId'] === 'number' ? response['userId'] : undefined,
    };
  }

  private parseJwt(token: string): Record<string, unknown> | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(json) as unknown;
      return typeof payload === 'object' && payload !== null
        ? payload as Record<string, unknown>
        : null;
    } catch {
      return null;
    }
  }

  private isAdminFromToken(token: string): boolean {
    const payload = this.parseJwt(token);
    if (!payload) {
      return false;
    }

    const rolesValue = payload['roles'] ?? payload['authorities'];
    const roles = Array.isArray(rolesValue)
      ? rolesValue.filter((role): role is string => typeof role === 'string')
      : typeof payload['role'] === 'string'
        ? [payload['role']]
        : [];

    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
  }

  /**
   * Handles login errors
   * @param error - Authentication error
   */
  private async handleLoginError(error: HttpErrorResponse | unknown): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Login failed. Please try again.');
    } catch {
      this.errorMessage = 'Login failed. Please try again.';

    }

    this.password = '';
  }

}
