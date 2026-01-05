import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule],
  template: `
    <div class="identity-card glass-panel fadeinleft animation-duration-800">
      <div class="card-header p-6">
        <div class="flex justify-content-between align-items-start mb-4">
          <img src="logo.png" alt="NEX" class="card-logo" />
          <div class="flex flex-column align-items-end">
            <span class="card-type">PREMIUM ACCESS</span>
            <div class="card-chip"></div>
          </div>
        </div>
        <div class="flex flex-column align-items-center mb-4">
          <p-avatar
            icon="pi pi-user"
            size="xlarge"
            shape="circle"
            styleClass="mbux-avatar border-2 border-primary-500 shadow-8 mb-3"
          >
          </p-avatar>
          <h2 class="text-white text-2xl font-bold m-0 tracking-widest uppercase">
            {{ user?.firstName }} {{ user?.lastName }}
          </h2>
          <span class="text-secondary text-xs tracking-widest">DRIVE AUTH: VALID</span>
        </div>
      </div>

      <div class="card-body p-5 pt-0">
        <div class="grid text-xs tracking-widest uppercase text-secondary">
          <div class="col-6 mb-3">
            <label class="block mb-1">Username</label>
            <div class="text-white font-bold">{{ user?.username }}</div>
          </div>
          <div class="col-6 mb-3">
            <label class="block mb-1">Rank</label>
            <div class="text-white font-bold capitalize">{{ user?.role }}</div>
          </div>
          <div class="col-12">
            <label class="block mb-1">Linked Email</label>
            <div class="text-white font-bold">{{ user?.email }}</div>
          </div>
        </div>

        <div class="flex gap-2 mt-5">
          <p-button
            label="Edit Data"
            icon="pi pi-pencil"
            styleClass="p-button-text p-button-sm w-full"
            (click)="onEdit()"
          ></p-button>
          <p-button
            label="Security"
            icon="pi pi-shield"
            styleClass="p-button-text p-button-sm w-full"
            (click)="onSecurity()"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .identity-card {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--ambient-color, #7b4dff), transparent 60%) 0%,
          rgba(30, 30, 45, 0.9) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

        &::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--ambient-color, #7b4dff), transparent 80%) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .card-logo {
          height: 52px;
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
          cursor: pointer;

          &:hover {
            transform: scale(1.15) rotate(-3deg);
            filter: drop-shadow(0 0 20px rgba(123, 77, 255, 0.6));
          }
        }

        .card-type {
          font-size: 10px;
          letter-spacing: 3px;
          color: var(--mbux-cyan);
          font-weight: 900;
        }

        .card-chip {
          width: 45px;
          height: 35px;
          background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
          border-radius: 8px;
          opacity: 0.95;
          margin-top: 5px;
          position: relative;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(0, 0, 0, 0.2);
          }
        }
      }
    `,
  ],
})
export class ProfileInfoComponent {
  @Input() user: User | null = null;
  @Output() edit = new EventEmitter<void>();
  @Output() security = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }

  onSecurity() {
    this.security.emit();
  }
}
