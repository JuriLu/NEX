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
      :host ::ng-deep {
        .mbux-table {
          /* PREMIUM STATUS SHINE WITH MBUX SHIMMER */
          .status-glow {
            padding: 0.5rem 1.25rem !important;
            font-weight: 800 !important;
            letter-spacing: 1.5px !important;
            text-transform: uppercase !important;
            border-radius: 30px !important;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease !important;

            &::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -100%;
              width: 50%;
              height: 200%;
              background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.6),
                transparent
              );
              transform: rotate(30deg);
              animation: profile-status-shine 2s infinite;
            }

            &.p-tag-success {
              background: rgba(34, 197, 94, 0.1) !important;
              color: #4ade80 !important;
              border: 1px solid rgba(34, 197, 94, 0.4) !important;
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3) !important;
              text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
            }

            &.p-tag-info {
              background: rgba(59, 130, 246, 0.1) !important;
              color: #60a5fa !important;
              border: 1px solid rgba(59, 130, 246, 0.4) !important;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
              text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }

            &.p-tag-warn {
              background: rgba(245, 158, 11, 0.1) !important;
              color: #fbbf24 !important;
              border: 1px solid rgba(245, 158, 11, 0.4) !important;
              box-shadow: 0 0 20px rgba(245, 158, 11, 0.3) !important;
              text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
            }
          }
        }
      }

      @keyframes profile-status-shine {
        0% {
          left: -100%;
        }
        25% {
          left: 150%;
        }
        100% {
          left: 150%;
        }
      }

      .car-thumb {
        width: 135px;
        height: 90px;
        border-radius: 16px;
        overflow: hidden !important;
        border: 1px solid rgba(139, 92, 246, 0.3);
        background: rgba(0, 0, 0, 0.4);
        padding: 0px !important;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover !important;
          border-radius: 14px;
          filter: brightness(1.1);
        }
      }

      .mbux-model-shine {
        font-size: 0.75rem;
        font-weight: 500;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.5) 0%,
          #ffffff 50%,
          rgba(255, 255, 255, 0.5) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: text-shine 3s linear infinite;
        display: block;
      }

      .mbux-cost-shine {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--ambient-color, #7b4dff), transparent 30%) 0%,
          #ffffff 50%,
          color-mix(in srgb, var(--ambient-color, #7b4dff), transparent 30%) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: text-shine 3s linear infinite;
        display: block;
        margin-top: 4px;
      }

      @keyframes text-shine {
        from {
          background-position: 200% center;
        }
        to {
          background-position: 0% center;
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
