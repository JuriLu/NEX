import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { DESIGN_SYSTEM } from '../../shared/theme/design-system';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, AnimateOnScrollModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    heroSection: [
      'hero-section',
      'flex',
      'align-items-center',
      'justify-content-center',
      'relative',
      'overflow-hidden',
    ],
    heroContent: [
      'col-12',
      'lg:col-6',
      'text-left',
      'py-8',
      'fadeinleft',
      'animation-duration-1000',
    ],
    heroBadge: ['flex', 'align-items-center', 'mb-4'],
    heroBadgeLine: ['line', 'w-3rem', 'h-2px', 'bg-primary', 'mr-3'],
    specPanel: [
      'spec-panel',
      'glass-panel',
      'p-3',
      'absolute',
      'top-0',
      'right-0',
      'mt-5',
      'mr-5',
      'hidden',
      'lg:block',
      'hover:transform-scale',
    ],
    featureCard: ['p-card', 'h-full', 'glass-panel', 'hover-glow', 'transition-all'],
    featureIcon: ['pi', 'text-4xl', 'text-gradient'],
  };
}
