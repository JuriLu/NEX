import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { ProfilePasswordDialogComponent } from './profile-password-dialog.component';

describe('ProfilePasswordDialogComponent', () => {
  it('should create', () => {
    const comp = new ProfilePasswordDialogComponent();
    expect(comp).toBeTruthy();
  });

  it('should emit visibleChange false and set visible to false on cancel', () => {
    const comp = new ProfilePasswordDialogComponent();
    comp.visible = true;
    const spy = vi.fn();
    comp.visibleChange.subscribe(spy);

    comp.onCancel();

    expect(comp.visible).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should emit update event on onUpdate', () => {
    const comp = new ProfilePasswordDialogComponent();
    const spy = vi.fn();
    comp.update.subscribe(spy);

    comp.onUpdate();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should accept a FormGroup input', () => {
    const comp = new ProfilePasswordDialogComponent();
    const form = new FormGroup({
      currentPassword: new FormControl('old'),
      newPassword: new FormControl('new'),
      confirmPassword: new FormControl('new'),
    });

    comp.form = form;

    expect(comp.form).toBe(form);
  });
});
