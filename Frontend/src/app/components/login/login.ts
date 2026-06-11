
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
        await this.router.navigate([this.tokenService.isAdmin() ? '/admin/quiz' : '/home']);
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

  /**
   * Handles login errors
   * @param error - Authentication error
   */
  private async handleLoginError(error: HttpErrorResponse | unknown): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Autentificare eșuată. Te rog încearcă din nou.');
    } catch {
      this.errorMessage = 'Autentificare eșuată. Te rog încearcă din nou.';

    }

    this.password = '';
  }

}
