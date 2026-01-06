import { FormControl, FormGroup } from '@angular/forms';
import { ProfileEditDialogComponent } from './profile-edit-dialog.component';

describe('ProfileEditDialogComponent', () => {
  let component: ProfileEditDialogComponent;

  beforeEach(() => {
    component = new ProfileEditDialogComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit visibleChange false and set visible to false on cancel', () => {
    const spy = vi.fn();
    component.visible = true;
    component.visibleChange.subscribe(spy);

    component.onCancel();

    expect(component.visible).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should emit save event on onSave', () => {
    const spy = vi.fn();
    component.save.subscribe(spy);

    component.onSave();

    expect(spy).toHaveBeenCalled();
  });

  it('should accept a FormGroup input', () => {
    const group = new FormGroup({ firstName: new FormControl('John') });
    component.form = group as FormGroup;
    expect(component.form.get('firstName')?.value).toBe('John');
  });
});
