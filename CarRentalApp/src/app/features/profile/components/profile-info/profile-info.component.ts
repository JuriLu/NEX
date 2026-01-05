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
