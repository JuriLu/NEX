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
          <tr class="asset-row">
            <td>
              <div class="flex align-items-center gap-4">
                <div class="asset-preview">
                  <img [src]="booking.car?.image" [alt]="booking.car?.brand" />
                </div>
                <div class="flex flex-column">
                  <span class="car-brand">{{ booking.car?.brand }}</span>
                  <span class="car-model">{{ booking.car?.model }}</span>
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
                styleClass="status-glow"
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
          .p-datatable-tbody > tr {
            background: transparent !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &:hover {
              background: var(--ambient-glow) !important;
              transform: translateY(-2px);
            }
          }

          /* PREMIUM STATUS SHINE */
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
            }

            &.p-tag-info {
              background: rgba(59, 130, 246, 0.1) !important;
              color: #60a5fa !important;
              border: 1px solid rgba(59, 130, 246, 0.4) !important;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
            }

            &.p-tag-danger {
              background: rgba(239, 68, 68, 0.1) !important;
              color: #f87171 !important;
              border: 1px solid rgba(239, 68, 68, 0.4) !important;
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.3) !important;
            }

            &.p-tag-secondary {
              background: rgba(148, 163, 184, 0.1) !important;
              color: #cbd5e1 !important;
              border: 1px solid rgba(148, 163, 184, 0.4) !important;
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

      .asset-preview {
        width: 160px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px !important;
        border-radius: 16px;
        overflow: hidden !important;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--ambient-glow);
        box-shadow: 0 8px 32px var(--ambient-glow);
        position: relative;
        flex-shrink: 0;
        transition: all 0.6s ease-in-out;

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 48px var(--ambient-color);
          border-color: var(--ambient-color);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover !important;
          border-radius: 16px;
          filter: brightness(1.05);
        }
      }

      .car-brand {
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 0.02em;
        margin-bottom: 0.1rem;
      }

      .car-model {
        color: rgba(255, 255, 255, 0.95);
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.03em;
        background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
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
