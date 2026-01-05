import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityUtils } from '../../core/utils/security.utils';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ContactComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with invalid form', () => {
    expect(component.contactForm.invalid).toBe(true);
  });

  it('should mark fields as invalid if empty and touched', () => {
    const nameControl = component.contactForm.get('name');
    nameControl?.markAsTouched();
    expect(nameControl?.invalid).toBe(true);

    const emailControl = component.contactForm.get('email');
    emailControl?.markAsTouched();
    expect(emailControl?.invalid).toBe(true);

    const messageControl = component.contactForm.get('message');
    messageControl?.markAsTouched();
    expect(messageControl?.invalid).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate name pattern', () => {
    const nameControl = component.contactForm.get('name');

    nameControl?.setValue('Invalid@Name1');
    expect(nameControl?.hasError('pattern')).toBe(true);

    nameControl?.setValue('Valid Name');
    expect(nameControl?.valid).toBe(true);
  });

  it('should sanitize data and reset form on valid submission', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const sanitizeSpy = vi.spyOn(SecurityUtils, 'sanitizeObject');

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    });

    component.onSubmit();

    expect(component.submitted).toBe(false);
    expect(sanitizeSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Form Submitted (Sanitized):', expect.anything());
    expect(alertSpy).toHaveBeenCalledWith(
      'Thank you for your message! We will get back to you soon.'
    );
    expect(component.contactForm.pristine).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit(); // Form is empty/invalid

    expect(component.submitted).toBe(true);
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
