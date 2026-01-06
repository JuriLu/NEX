import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ThemeService } from './core/services/theme.service';
import { init } from './core/store/auth/auth.actions';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('CarRentalApp');
  private store = inject(Store);
  protected theme = inject(ThemeService);

  constructor() {
    // Global Ambient Lighting Sync
    effect(() => {
      const color = this.theme.ambientColor();
      const rgba = this.theme.getAmbientRgba(0.5);

      document.documentElement.style.setProperty('--ambient-color', color);
      document.documentElement.style.setProperty('--ambient-glow', rgba);
    });
  }

  ngOnInit() {
    this.store.dispatch(init());
  }
}
