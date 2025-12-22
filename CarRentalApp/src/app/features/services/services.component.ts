import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="px-4 py-8 md:px-6 lg:px-8">
      <div class="text-center mb-5">
        <h2 class="text-4xl font-bold text-900 mb-2">Our Services</h2>
        <p class="text-600 font-medium">Experience luxury and convenience at every step.</p>
      </div>

      <div class="grid">
        <div class="col-12 md:col-6 lg:col-4 p-3">
          <p-card
            title="Short Term Rental"
            styleClass="h-full border-round-xl shadow-2 hover:shadow-6 transition-duration-300"
          >
            <div class="flex align-items-center mb-3">
              <i class="pi pi-clock text-3xl text-primary mr-3"></i>
              <span class="text-xl font-bold">Short Term</span>
            </div>
            <p class="text-600 line-height-3">
              Perfect for business trips or weekend getaways. Flexible daily rates.
            </p>
          </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4 p-3">
          <p-card
            title="Luxury Experience"
            styleClass="h-full border-round-xl shadow-2 hover:shadow-6 transition-duration-300"
          >
            <div class="flex align-items-center mb-3">
              <i class="pi pi-star text-3xl text-primary mr-3"></i>
              <span class="text-xl font-bold">Premium Selection</span>
            </div>
            <p class="text-600 line-height-3">
              Access to our high-end fleet including Tesla, BMW, and Mercedes.
            </p>
          </p-card>
        </div>
        <div class="col-12 md:col-6 lg:col-4 p-3">
          <p-card
            title="24/7 Support"
            styleClass="h-full border-round-xl shadow-2 hover:shadow-6 transition-duration-300"
          >
            <div class="flex align-items-center mb-3">
              <i class="pi pi-phone text-3xl text-primary mr-3"></i>
              <span class="text-xl font-bold">Always Here</span>
            </div>
            <p class="text-600 line-height-3">
              Round-the-clock roadside assistance and customer support.
            </p>
          </p-card>
        </div>
      </div>
    </div>
  `,
})
export class ServicesComponent {}
