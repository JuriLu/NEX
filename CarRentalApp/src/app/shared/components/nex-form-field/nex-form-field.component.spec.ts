import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { NexFormFieldComponent } from './nex-form-field.component';

describe('NexFormFieldComponent', () => {
  let component: NexFormFieldComponent;
  let fixture: ComponentFixture<NexFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NexFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NexFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty error message if control has no errors', () => {
    component.control = new FormControl('test');
    expect(component.getErrorMessage()).toBe('');
  });

  it('should return email error message', () => {
    component.control = new FormControl('invalid', Validators.email);
    component.control.markAsTouched();
    expect(component.getErrorMessage()).toBe('Invalid email format.');
  });

  it('should return minlength error message', () => {
    component.control = new FormControl('a', Validators.minLength(5));
    expect(component.getErrorMessage()).toBe('Minimum length is 5.');
  });

  it('should return pattern error message', () => {
    component.control = new FormControl('a', Validators.pattern('[0-9]'));
    expect(component.getErrorMessage()).toBe('Invalid format.');
  });

  it('should return min error message', () => {
    component.control = new FormControl(1, Validators.min(10));
    expect(component.getErrorMessage()).toBe('Minimum value is 10.');
  });

  it('should return mismatch error message', () => {
    const control = new FormControl('test');
    control.setErrors({ mismatch: true });
    component.control = control;
    expect(component.getErrorMessage()).toBe('Passwords do not match.');
  });

  it('should return notUnique/usernameTaken error message', () => {
    const control = new FormControl('test');
    control.setErrors({ notUnique: true });
    component.control = control;
    expect(component.getErrorMessage()).toBe('Username is already taken.');

    control.setErrors({ usernameTaken: true });
    expect(component.getErrorMessage()).toBe('Username is already taken.');
  });

  it('should return custom sequence errors', () => {
    const control = new FormControl('test');

    control.setErrors({ uppercase: true });
    component.control = control;
    expect(component.getErrorMessage()).toBe('Must contain an uppercase letter.');

    control.setErrors({ number: true });
    expect(component.getErrorMessage()).toBe('Must contain a number.');

    control.setErrors({ special: true });
    expect(component.getErrorMessage()).toBe('Must contain a special character.');
  });

  it('should return generic error message for unknown keys', () => {
    const control = new FormControl('test');
    control.setErrors({ unknown: true });
    component.control = control;
    expect(component.getErrorMessage()).toBe('Invalid value.');
  });
});
