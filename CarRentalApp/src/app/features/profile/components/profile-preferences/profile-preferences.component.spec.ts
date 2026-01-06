import { describe, expect, it, vi } from 'vitest';
import { ProfilePreferencesComponent } from './profile-preferences.component';

describe('ProfilePreferencesComponent', () => {
  it('should create', () => {
    const comp = new ProfilePreferencesComponent();
    expect(comp).toBeTruthy();
  });

  it('should emit colorChange when selectColor is called', () => {
    const comp = new ProfilePreferencesComponent();
    const spy = vi.fn();
    comp.colorChange.subscribe(spy);

    comp.selectColor('#ff0000');

    expect(spy).toHaveBeenCalledWith('#ff0000');
  });

  it('should accept ambientColors and selectedColor inputs', () => {
    const comp = new ProfilePreferencesComponent();
    const colors = [
      { name: 'Red', color: '#ff0000' },
      { name: 'Blue', color: '#0000ff' },
    ];

    comp.ambientColors = colors;
    comp.selectedColor = '#0000ff';

    expect(comp.ambientColors).toBe(colors);
    expect(comp.selectedColor).toBe('#0000ff');
  });
});
