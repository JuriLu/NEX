import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SecurityUtils } from '../../../core/utils/security.utils';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../../core/store/auth/auth.actions';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { ToastModule } from 'primeng/toast';
import { DESIGN_SYSTEM } from '../../../shared/theme/design-system';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    authWrapper: [
      'auth-wrapper',
      'flex',
      'align-items-center',
      'justify-content-center',
      'min-h-screen',
      'relative',
      'overflow-hidden',
    ],
    authCard: ['glass-panel', 'auth-card', 'p-5', 'relative', 'overflow-hidden'],
    logoBox: ['auth-logo-box', 'mb-4', 'glass-panel', 'inline-flex', 'p-3'],
    validationWarning: ['validation-warning'],
    label: [
      'block',
      'text-secondary',
      'font-bold',
      'uppercase',
      'tracking-widest',
      'text-xs',
      'mb-2',
    ],
  };

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); // Inject AuthService
  private messageService = inject(MessageService); 
  private store = inject(Store); // Inject Store

  submitted = false;
  loading = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
    username: [
      '', 
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)], 
      [this.usernameUniqueValidator.bind(this)]
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(6),
      (control: any) => (/[A-Z]/.test(control.value) ? null : { uppercase: true }),
      (control: any) => (/[0-9]/.test(control.value) ? null : { number: true }),
      (control: any) => (/[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { special: true })
    ]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.loading = true;
      const sanitizedData = SecurityUtils.sanitizeObject(this.registerForm.value);
      
      this.authService.register(sanitizedData).subscribe({
        next: (user) => this.handleRegistrationSuccess(user),
        error: (err) => this.handleRegistrationError(err)
      });
    }
  }

  private handleRegistrationSuccess(user: any) {
    // 1. Show Glowy Success Toast
    this.messageService.add({
      severity: 'success',
      summary: 'Welcome to NEX',
      detail: `Initiating Launch Sequence for pilot: <b>${user.firstName} ${user.lastName}</b>`,
      life: 5000,
      styleClass: 'mbux-toast-success'
    });

    // 2. Auto-Login: Dispatch to Store to update Global State
    this.store.dispatch(loginSuccess({ user }));

    setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/catalog']); // Redirect to main app
    }, 1500);
  }

  private handleRegistrationError(err: any) {
    console.error('Registration failed', err);
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Registration Failed',
      detail: 'Could not create identity.',
    });
  }


  // Custom Validator: Password Match
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // Async Validator: Username Unique
  usernameUniqueValidator(control: AbstractControl) {
    return this.authService.checkUsernameUnique(control.value).pipe(
      map(isUnique => (isUnique ? null : { notUnique: true })),
      catchError(() => of(null))
    );
  }
}
