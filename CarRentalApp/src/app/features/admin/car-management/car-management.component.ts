import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../../core/models/car.model';
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

@Component({
  selector: 'app-car-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, ReactiveFormsModule,
    ConfirmDialogModule, ToastModule, ToggleSwitchModule, SelectModule,
    FileUploadModule, TagModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './car-management.component.html',
  styleUrl: './car-management.component.scss'
})
export class CarManagementComponent implements OnInit {
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

  categories = [
    { label: 'Electric', value: 'Electric' },
    { label: 'Sport', value: 'Sport' },
    { label: 'Luxury', value: 'Luxury' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Convertible', value: 'Convertible' }
  ];

  currencies = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' }
  ];

  ngOnInit() {
    this.loadCars();
    this.initForm();
  }

  loadCars() {
    this.carService.getCars().subscribe(cars => this.cars = cars);
  }

  initForm() {
    this.carForm = this.fb.group({
      brand: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      model: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s-]+$/)]],
      category: [null, Validators.required],
      pricePerDay: [null, [Validators.required, Validators.min(1)]],
      currency: ['USD', Validators.required],
      image: [''], // Optional
      available: [true]
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
            this.cars = this.cars.filter(val => val.id !== car.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Car Deleted', life: 3000 });
          },
          error: (err) => {
            console.error('Delete Car Error:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete car', life: 3000 });
          }
        });
      }
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

    if (this.carForm.valid) {
      const carData = SecurityUtils.sanitizeObject(this.carForm.value);

      if (this.editingCar) {
        this.carService.updateCar({ ...this.editingCar, ...carData }).subscribe({
          next: () => {
            this.loadCars();
            this.hideDialog();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Car Updated', life: 3000 });
          },
          error: (err) => {
            console.error('Update Car Error:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update car', life: 3000 });
          }
        });
      } else {
        // In real app, features would be a form array. For mock, just empty array.
        this.carService.addCar({ ...carData, features: [] }).subscribe({
          next: () => {
            this.loadCars();
            this.hideDialog();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Car Created', life: 3000 });
          },
          error: (err) => {
            console.error('Add Car Error:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not add car', life: 3000 });
          }
        });
      }
    }
  }

  hideDialog() {
    this.carDialog = false;
    this.submitted = false;
  }
}
