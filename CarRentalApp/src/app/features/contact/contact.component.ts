import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SecurityUtils } from '../../core/utils/security.utils';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, TextareaModule, ButtonModule],
  template: `
    <div class="surface-ground px-4 py-8 md:px-6 lg:px-8">
      <div class="grid justify-content-center">
        <div class="col-12 md:col-8 lg:col-6">
          <p-card styleClass="shadow-4 border-round-xl">
            <h2 class="text-3xl font-bold mb-4 text-center">Contact Us</h2>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
              <div class="field">
                <label for="name" class="block font-medium mb-2">Name</label>
                <input pInputText id="name" formControlName="name" class="w-full" placeholder="Your Name" />
                @if ((submitted || contactForm.get('name')?.touched) && contactForm.get('name')?.invalid) {
                  <div class="validation-warning mt-2 p-2 border-round">
                    <i class="pi pi-exclamation-circle mr-2"></i>
                    @if (contactForm.get('name')?.hasError('pattern')) {
                      Please use only letters and spaces.
                    } @else {
                      Name is required.
                    }
                  </div>
                }
              </div>
              <div class="field">
                <label for="email" class="block font-medium mb-2">Email</label>
                <input pInputText id="email" formControlName="email" class="w-full" placeholder="your.email@example.com" />
                @if ((submitted || contactForm.get('email')?.touched) && contactForm.get('email')?.invalid) {
                  <div class="validation-warning mt-2 p-2 border-round">
                    <i class="pi pi-exclamation-circle mr-2"></i>
                    Valid email is required.
                  </div>
                }
              </div>
              <div class="field">
                <label for="message" class="block font-medium mb-2">Message</label>
                <textarea pInputTextarea id="message" formControlName="message" [rows]="5" class="w-full" placeholder="How can we help?"></textarea>
                @if ((submitted || contactForm.get('message')?.touched) && contactForm.get('message')?.invalid) {
                  <div class="validation-warning mt-2 p-2 border-round">
                    <i class="pi pi-exclamation-circle mr-2"></i>
                    Message cannot be empty.
                  </div>
                }
              </div>
              <p-button label="Send Message" icon="pi pi-send" type="submit" styleClass="w-full"></p-button>
            </form>
          </p-card>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      const sanitizedData = SecurityUtils.sanitizeObject(this.contactForm.value);
      console.log('Form Submitted (Sanitized):', sanitizedData);
      alert('Thank you for your message! We will get back to you soon.');
      this.contactForm.reset();
      this.submitted = false;
    }
  }
}
