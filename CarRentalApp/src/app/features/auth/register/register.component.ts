import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SecurityUtils } from '../../../core/utils/security.utils';
import { MessageService } from 'primeng/api';

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
  private messageService = inject(MessageService); // Assuming MessageService is available or will handle toast differently

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
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.loading = true;
      const sanitizedData = SecurityUtils.sanitizeObject(this.registerForm.value);
      console.log('Register Payload (Sanitized):', sanitizedData);

      this.authService.register(sanitizedData).subscribe({
        next: () => {
          // Success Toast would go here
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.loading = false;
        }
      });
    }
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
