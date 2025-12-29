import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car, CarCategory, Currency } from '../../../core/models/car.model';
import { SelectOption } from '../../../core/models/common.model';
import { CarService } from '../../../core/services/car.service';
import { SecurityUtils } from '../../../core/utils/security.utils';

// PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { DESIGN_SYSTEM } from '../../../shared/theme/design-system';
import { NexDialogComponent } from '../../../shared/components/nex-dialog/nex-dialog.component';
import { NexFormFieldComponent } from '../../../shared/components/nex-form-field/nex-form-field.component';

@Component({
  selector: 'app-car-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    ToggleSwitchModule,
    SelectModule,
    FileUploadModule,
    TagModule,
    NexDialogComponent,
    NexFormFieldComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './car-management.component.html',
  styleUrl: './car-management.component.scss',
})
export class CarManagementComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    opsCenter: ['ops-center', 'py-8', 'px-4', 'lg:px-8'],
    tableContainer: ['overflow-hidden', 'fadeinup', 'animation-duration-1000'],
    tableHeader: ['uppercase', 'tracking-widest', 'text-sm', 'font-bold'],
    fieldLabel: [
      'block',
      'text-secondary',
      'font-bold',
      'uppercase',
      'tracking-widest',
      'text-xs',
      'mb-2',
    ],
    assetPreview: ['asset-preview', 'glass-panel'],
    imageUploader: [
      'image-uploader',
      'glass-panel',
      'p-4',
      'flex',
      'flex-column',
      'align-items-center',
      'gap-4',
    ],
  };

  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  cars: Car[] = [];
  carDialog = false;
  carForm!: FormGroup;
  submitted = false;
  editingCar: Car | null = null;
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  categories: SelectOption[] = [
    { label: 'Electric', value: CarCategory.ELECTRIC },
    { label: 'Sport', value: CarCategory.SPORT },
    { label: 'Luxury', value: CarCategory.LUXURY },
    { label: 'SUV', value: CarCategory.SUV },
    { label: 'Convertible', value: CarCategory.CONVERTIBLE },
  ];

  currencies: SelectOption[] = [
    { label: 'USD ($)', value: Currency.USD },
    { label: 'EUR (€)', value: Currency.EUR },
    { label: 'GBP (£)', value: Currency.GBP },
  ];

  ngOnInit() {
    this.loadCars();
    this.initForm();
  }

  loadCars() {
    this.carService.getCars().subscribe((cars) => (this.cars = cars));
  }

  initForm() {
    this.carForm = this.fb.group({
      brand: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      model: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      category: [null, Validators.required],
      pricePerDay: [null, [Validators.required, Validators.min(1)]],
      currency: ['USD', Validators.required],
      image: [''], // Optional
      available: [true],
    });
  }

  openNew() {
    this.editingCar = null;
    this.carForm.reset({ available: true, pricePerDay: 0 });
    this.submitted = false;
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.carDialog = true;
  }

  editCar(car: Car) {
    this.editingCar = car;
    this.carForm.patchValue(car);
    this.selectedImageFile = null;
    this.imagePreview = car.image;
    this.carDialog = true;
  }

  deleteCar(car: Car) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${car.brand} ${car.model}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carService.deleteCar(car.id).subscribe({
          next: () => {
            this.cars = this.cars.filter((val) => val.id !== car.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Car Deleted',
              life: 3000,
            });
          },
          error: (err) => this.handleError('Error', 'Could not delete car', err),
        });
      },
    });
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.carForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  saveCar() {
    this.submitted = true;

    if (this.carForm.invalid) {
      return;
    }

    const carData = SecurityUtils.sanitizeObject(this.carForm.value);
    
    // Determine action and observable
    const isEditing = !!this.editingCar;
    const request$ = isEditing
      ? this.carService.updateCar({ ...this.editingCar, ...carData })
      : this.carService.addCar({ ...carData, features: [] });
      
    const action = isEditing ? 'Updated' : 'Created';

    request$.subscribe({
      next: () => this.handleSuccess(`Car ${action}`),
      error: (err) => this.handleError('Error', `Could not ${isEditing ? 'update' : 'add'} car`, err)
    });
  }

  private handleSuccess(detail: string) {
    this.loadCars();
    this.hideDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: detail,
      life: 3000,
    });
  }

  private handleError(summary: string, detail: string, error?: any) {
    console.error(detail, error);
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }

  hideDialog() {
    this.carDialog = false;
    this.submitted = false;
  }
}
