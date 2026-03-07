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
      errors['email'] = 'Email is required.';
    } else if (!this.isValidEmail(email.trim())) {
      errors['email'] = 'Please enter a valid email address.';
    }

    if (!password) {
      errors['password'] = 'Password is required.';
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
      errors.name = 'Name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    }

    // Validate email
    if (!email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!this.isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required.';
    }

    // Validate password confirmation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    const isValid = Object.values(errors).every(error => error === '');

    return {
      isValid,
      errors
    };
  }
}

