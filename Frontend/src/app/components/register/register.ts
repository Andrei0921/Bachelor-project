import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthControllerService} from '../../api';
import {FormService} from '../../services/form.service';
import {HttpResponseService} from '../../services/http-response.service';
import {ToastService} from '../../services/toast.service';

interface FieldErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: 'register.html',
  styleUrls: ["register.css"],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
  ]
})
export class RegisterComponent {
  // Form data
  name = '';
  email = '';
  password = '';
  confirmPassword = '';


  isLoading = false;
  errorMessage = '';
  successMessage = '';
  fieldErrors: FieldErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authController: AuthControllerService,
    private router: Router,
    private formUtils: FormService,
    private httpResponseService: HttpResponseService,
    private toastService: ToastService
  ) {
  }

  /**
   * Handles form submission for registration
   */
  onRegister(): void {
    const validation = this.formUtils.validateRegisterForm(this.name, this.email, this.password, this.confirmPassword);
    if (!validation.isValid) {
      this.fieldErrors = validation.errors;
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const userData = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.authController.register(userData as any).subscribe({
      next: (response) => {
        this.handleRegistrationSuccess(response);
      },
      error: (error) => {
        this.handleRegistrationError(error);
      }
    });
  }


  /**
   * Handles successful registration
   * @param response - Authentication response
   */
  private async handleRegistrationSuccess(response: any): Promise<void> {
    this.isLoading = false;

    try {
      const parsedResponse = await this.httpResponseService.handleResponse(response);
      this.successMessage = (parsedResponse as any)?.message || 'Registration successful! You can now log in.';
      this.clearForm();

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error) {
      this.errorMessage = 'Failed to process registration response';
      this.toastService.error(this.errorMessage);
    }
  }

  /**
   * Handles registration errors
   * @param error - Authentication error
   */
  private async handleRegistrationError(error: any): Promise<void> {
    this.isLoading = false;

    try {
      this.errorMessage = await this.httpResponseService.handleError(error, 'Registration failed. Please try again.');
      this.toastService.error(this.errorMessage);
    } catch {
      this.errorMessage = 'Registration failed. Please try again.';
      this.toastService.error(this.errorMessage);
    }

    this.password = '';
    this.confirmPassword = '';
  }


  /**
   * Clears all error and success messages
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.clearFieldErrors();
  }

  /**
   * Clears all field-specific errors
   */
  private clearFieldErrors(): void {
    this.fieldErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  /**
   * Clears all form data
   */
  private clearForm(): void {
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}

