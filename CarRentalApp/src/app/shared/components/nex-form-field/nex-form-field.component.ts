import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nex-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="field mb-5 mbux-inline-field">
      <label [for]="inputId" class="mbux-field-label">{{ label }}</label>
      <div class="input-wrapper">
        <ng-content></ng-content>

        <!-- Validation Errors -->
        @if (control && (control.dirty || control.touched) && control.invalid) {
        <!-- Required Error -->
        @if (control.hasError('required')) {
        <div class="validation-warning mt-2">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ label }} is required.</span>
        </div>
        }

        <!-- Generic/Other Errors -->
        @if (!control.hasError('required') && control.errors) {
        <div class="validation-warning innovative mt-2">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ getErrorMessage() }}</span>
        </div>
        } }
      </div>
    </div>
  `,
  styles: [],
})
export class NexFormFieldComponent {
  @Input() label = '';
  @Input() control: AbstractControl | null = null;
  @Input() inputId = '';

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    const errors = this.control.errors;
    if (errors['email']) return 'Invalid email format.';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}.`;
    if (errors['pattern']) return 'Invalid format.';
    if (errors['min']) return `Minimum value is ${errors['min'].min}.`;
    if (errors['mismatch']) return 'Passwords do not match.';
    if (errors['notUnique']) return 'Username is already taken.';
    if (errors['usernameTaken']) return 'Username is already taken.';

    // Custom error keys from previous refactors
    if (errors['uppercase']) return 'Must contain an uppercase letter.';
    if (errors['number']) return 'Must contain a number.';
    if (errors['special']) return 'Must contain a special character.';

    return 'Invalid value.';
  }
}
