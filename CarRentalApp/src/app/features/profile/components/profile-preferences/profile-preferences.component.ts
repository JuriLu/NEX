import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-profile-preferences',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <div class="glass-panel mt-4 p-5 fadeinleft animation-duration-1000">
      <h3 class="text-white uppercase tracking-widest text-sm mb-4">Cabin Customization</h3>
      <div class="mb-4">
        <label class="text-secondary text-xs uppercase tracking-widest block mb-3"
          >Ambient Lighting</label
        >
        <div class="flex gap-2 flex-wrap">
          @for (item of ambientColors; track item.color) {
          <div
            class="color-node"
            [style.background]="item.color"
            [style.color]="item.color"
            [class.active]="selectedColor === item.color"
            [pTooltip]="item.name"
            (click)="selectColor(item.color)"
          >
            @if (selectedColor === item.color) {
            <i class="pi pi-check text-xs"></i>
            }
          </div>
          }
        </div>
      </div>
      <div>
        <label class="text-secondary text-xs uppercase tracking-widest block mb-2"
          >Digital Key Status</label
        >
        <div class="flex align-items-center gap-3 glass-node p-3">
          <i class="pi pi-key text-primary"></i>
          <span class="text-white text-sm">Synchronized with NEX Mobile</span>
          <i class="pi pi-check-circle text-success ml-auto"></i>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .color-node {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }

        &.active {
          border: 2px solid white;
          transform: scale(1.1);
        }
      }

      .glass-node {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }
    `,
  ],
})
export class ProfilePreferencesComponent {
  @Input() ambientColors: any[] = [];
  @Input() selectedColor: string = '';
  @Output() colorChange = new EventEmitter<string>();

  selectColor(color: string) {
    this.colorChange.emit(color);
  }
}
