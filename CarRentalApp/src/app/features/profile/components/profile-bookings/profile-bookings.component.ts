import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-profile-bookings',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  template: `
    <div class="glass-panel h-full fadeinup animation-duration-800 overflow-hidden">
      <div
        class="p-5 border-bottom-1 border-white-alpha-10 flex justify-content-between align-items-center"
      >
        <h2 class="text-white m-0 text-xl tracking-widest uppercase">Mission Archive</h2>
        <span class="text-secondary text-xs">TOTAL DEPLOYMENTS: {{ bookings?.length || 0 }}</span>
      </div>

      <p-table [value]="bookings || []" styleClass="mbux-table">
        <ng-template pTemplate="header">
          <tr>
            <th class="text-xs uppercase tracking-widest text-secondary font-bold">Vehicle Unit</th>
            <th class="text-xs uppercase tracking-widest text-secondary font-bold">
              Deployment Window
            </th>
            <th class="text-xs uppercase tracking-widest text-secondary font-bold">Status</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-booking>
          <tr class="history-row">
            <td>
              <div class="flex align-items-center gap-3">
                <div class="car-thumb glass-panel">
                  <img [src]="booking.car?.image" [alt]="booking.car?.brand" />
                </div>
                <div class="flex flex-column">
                  <span class="text-white font-bold">{{ booking.car?.brand }}</span>
                  <span class="mbux-model-shine">{{ booking.car?.model }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="text-white font-medium text-sm">
                {{ booking.startDate | date : 'MMM d' }} - {{ booking.endDate | date : 'MMM d, y' }}
              </div>
              <span class="mbux-cost-shine"
                >Cost: {{ booking.totalPrice | currency : booking.currency }}</span
              >
            </td>
            <td>
              <p-tag
                [value]="booking.status"
                [severity]="getBookingSeverity(booking.status)"
                [ngClass]="{ 'status-glow': true }"
              ></p-tag>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="3" class="text-center py-8">
              <i class="pi pi-history text-4xl text-secondary-300 opacity-20 mb-3 block"></i>
              <span class="text-secondary tracking-widest text-sm uppercase"
                >No deployment history found.</span
              >
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      .car-thumb {
        width: 60px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    `,
  ],
})
export class ProfileBookingsComponent {
  @Input() bookings: any[] | null = [];

  getBookingSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'Completed':
        return 'secondary';
      default:
        return 'info';
    }
  }
}
