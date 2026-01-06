import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-profile-preferences',
  standalone: true,
  imports: [CommonModule, TooltipModule, ToggleSwitchModule, FormsModule],
  template: `
    <div class="glass-panel mt-4 p-5 fadeinleft animation-duration-1000">
      <div class="flex justify-content-between align-items-center mb-5">
        <h3 class="text-white uppercase tracking-widest text-sm m-0">Cabin Customization</h3>
        <div class="flex align-items-center gap-3">
          <span class="text-secondary text-xs uppercase tracking-widest">Ambient Mode</span>
          <p-toggleSwitch
            [(ngModel)]="isAmbientOn"
            (onChange)="onToggleChange($event)"
            styleClass="mbux-switch"
          ></p-toggleSwitch>
        </div>
      </div>

      <div class="mb-5">
        <label class="text-secondary text-xs uppercase tracking-widest block mb-3"
          >Accent Architecture</label
        >
        <div class="flex gap-2 flex-wrap">
          @for (item of ambientColors; track item.color) {
          <div
            class="color-node"
            [style.background]="item.color"
            [style.color]="item.color"
            [class.active]="theme.ambientColor() === item.color"
            [pTooltip]="item.name"
            (click)="selectColor(item.color)"
          >
            @if (theme.ambientColor() === item.color) {
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
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        &:hover {
          transform: scale(1.2);
        }

        &.active {
          border-color: white;
          box-shadow: 0 0 15px currentColor;
          transform: scale(1.1);
        }
      }

      .glass-node {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
      }
    `,
  ],
})
export class ProfilePreferencesComponent {
  @Input() ambientColors: any[] = [];
  protected theme = inject(ThemeService);

  get isAmbientOn(): boolean {
    return this.theme.isAmbientOn();
  }

  set isAmbientOn(value: boolean) {
    this.theme.toggleAmbient(value);
  }

  onToggleChange(event: any) {
    this.theme.toggleAmbient(event.checked);
  }

  selectColor(color: string) {
    this.theme.setAmbientColor(color);
  }
}
