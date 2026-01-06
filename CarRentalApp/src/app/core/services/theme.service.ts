import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly AMBIENT_COLOR_KEY = 'mbux_ambient_color';
  private readonly AMBIENT_TOGGLE_KEY = 'mbux_ambient_toggle';

  // Default to a premium purple if none saved
  readonly ambientColor = signal<string>(localStorage.getItem(this.AMBIENT_COLOR_KEY) || '#8b5cf6');

  readonly isAmbientOn = signal<boolean>(localStorage.getItem(this.AMBIENT_TOGGLE_KEY) === 'true');

  constructor() {
    // Sync to localStorage whenever signals change
    effect(() => {
      const color: string = this.ambientColor();
      localStorage.setItem(this.AMBIENT_COLOR_KEY, color);
    });

    effect(() => {
      localStorage.setItem(this.AMBIENT_TOGGLE_KEY, String(this.isAmbientOn()));
    });
  }

  setAmbientColor(color: string) {
    this.ambientColor.set(color);
  }

  toggleAmbient(status: boolean) {
    this.isAmbientOn.set(status);
  }

  getAmbientRgba(opacity: number = 0.5): string {
    const hex: string = this.ambientColor();
    const r: number = parseInt(hex.slice(1, 3), 16);
    const g: number = parseInt(hex.slice(3, 5), 16);
    const b: number = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
