import { describe, expect, it, vi } from 'vitest';
import { User } from '../../../../core/models/user.model';
import { ProfileInfoComponent } from './profile-info.component';

describe('ProfileInfoComponent', () => {
  it('should create', () => {
    const comp = new ProfileInfoComponent();
    expect(comp).toBeTruthy();
  });

  it('should emit edit event when onEdit is called', () => {
    const comp = new ProfileInfoComponent();
    const spy = vi.fn();
    comp.edit.subscribe(spy);

    comp.onEdit();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit security event when onSecurity is called', () => {
    const comp = new ProfileInfoComponent();
    const spy = vi.fn();
    comp.security.subscribe(spy);

    comp.onSecurity();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should accept a User input', () => {
    const comp = new ProfileInfoComponent();
    const user: User = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jdoe',
      email: 'jane@example.com',
      role: 'user',
    } as User;

    comp.user = user;

    expect(comp.user).toEqual(user);
  });
});
