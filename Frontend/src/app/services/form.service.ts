import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface RegisterValidationResult {
  isValid: boolean;
  errors: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  /**
   * Validates email format
   * @param email - Email to validate
   * @returns boolean indicating if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates login form
   * @param email - User email
   * @param password - User password
   * @returns Validation result with errors
   */
  validateLoginForm(email: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!email?.trim()) {
      errors['email'] = 'Email este obligatoriu.';
    } else if (!this.isValidEmail(email.trim())) {
      errors['email'] = 'Introduce-ți o adresă valida.';
    }

    if (!password) {
      errors['password'] = 'Parola este obligatorie.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validates registration form
   * @param name - User name
   * @param email - User email
   * @param password - User password
   * @param confirmPassword - Password confirmation
   * @returns Validation result with field-specific errors
   */
  validateRegisterForm(name: string, email: string, password: string, confirmPassword: string): RegisterValidationResult {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Validate name
    if (!name?.trim()) {
      errors.name = 'Numele este obligatoriu.';
    } else if (name.trim().length < 2) {
      errors.name = 'Nnumele este prea scurt(cel putin 2 caractere).';
    }

    // Validate email
    if (!email?.trim()) {
      errors.email = 'Email este ebligatoriu.';
    } else if (!this.isValidEmail(email.trim())) {
      errors.email = 'Introduce-ți o adresă validă.';
    }

    // Validate password
    if (!password) {
      errors.password = 'Parola este obligatorie.';
    }

    // Validate password confirmation
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmați parola.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Parolele nu se potrivesc.';
    }

    const isValid = Object.values(errors).every(error => error === '');

    return {
      isValid,
      errors
    };
  }
}

