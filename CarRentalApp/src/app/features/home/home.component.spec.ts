import { describe, expect, it } from 'vitest';
import { DESIGN_SYSTEM } from '../../shared/theme/design-system';
import { HomeComponent } from './home.component';

describe('HomeComponent (class-only)', () => {
  it('should create and expose theme', () => {
    const comp = new HomeComponent();
    expect(comp).toBeTruthy();
    expect(comp.theme).toBe(DESIGN_SYSTEM);
  });

  it('should have styles groups and expected tokens', () => {
    const comp = new HomeComponent();
    const s = comp.styles;

    // Ensure keys exist
    expect(Array.isArray(s.heroSection)).toBe(true);
    expect(Array.isArray(s.heroContent)).toBe(true);
    expect(Array.isArray(s.heroBadge)).toBe(true);
    expect(Array.isArray(s.heroBadgeLine)).toBe(true);
    expect(Array.isArray(s.specPanel)).toBe(true);
    expect(Array.isArray(s.featureCard)).toBe(true);
    expect(Array.isArray(s.featureIcon)).toBe(true);

    // Check some token presence
    expect(s.heroSection).toContain('hero-section');
    expect(s.heroContent).toContain('fadeinleft');
    expect(s.heroContent).toContain('animation-duration-1000');
    expect(s.heroBadgeLine).toContain('w-3rem');
    expect(s.specPanel).toContain('spec-panel');
    expect(s.featureIcon).toContain('pi');
  });
});
