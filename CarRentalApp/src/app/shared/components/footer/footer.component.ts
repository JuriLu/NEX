import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly styles = {
    sectionHeading: ['text-white', 'font-bold', 'mb-4', 'uppercase', 'tracking-wider', 'text-sm'],
    footerLink: [
      'text-secondary',
      'hover:text-white',
      'transition-all',
      'cursor-pointer',
      'no-underline',
    ],
    socialCircle: [
      'social-circle',
      'glass-panel',
      'flex',
      'align-items-center',
      'justify-content-center',
      'cursor-pointer',
    ],
    listContainer: ['list-none', 'p-0', 'm-0', 'flex', 'flex-column', 'gap-3'],
    secondaryText: ['text-secondary', 'line-height-4', 'max-w-20rem'],
    columnSection: ['col-6', 'md:col-2', 'p-3'],
  };
}
