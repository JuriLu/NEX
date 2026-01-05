import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NexDialogComponent } from '../../../../shared/components/nex-dialog/nex-dialog.component';
import { NexFormFieldComponent } from '../../../../shared/components/nex-form-field/nex-form-field.component';

@Component({
  selector: 'app-profile-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    NexDialogComponent,
    NexFormFieldComponent,
  ],
  template: `
    <app-nex-dialog [visible]="visible" header="Edit Profile" width="600px" (onHide)="onCancel()">
      <div body>
        <form [formGroup]="form" class="grid mt-2">
          <div class="col-12 md:col-6 field flex flex-column">
            <app-nex-form-field label="First Name" [control]="form.get('firstName')">
              <input type="text" pInputText formControlName="firstName" class="mbux-input w-full" />
            </app-nex-form-field>
          </div>
          <div class="col-12 md:col-6 field flex flex-column">
            <app-nex-form-field label="Last Name" [control]="form.get('lastName')">
              <input type="text" pInputText formControlName="lastName" class="mbux-input w-full" />
            </app-nex-form-field>
          </div>
          <div class="col-12 field flex flex-column">
            <app-nex-form-field label="Email" [control]="form.get('email')">
              <input type="email" pInputText formControlName="email" class="mbux-input w-full" />
            </app-nex-form-field>
          </div>
          <div class="col-12 field flex flex-column">
            <app-nex-form-field label="System Username" [control]="form.get('username')">
              <input type="text" pInputText formControlName="username" class="mbux-input w-full" />
            </app-nex-form-field>
          </div>
        </form>
      </div>
      <div footer>
        <div class="mbux-dialog-footer">
          <p-button label="Abort" (click)="onCancel()" styleClass="p-button-text"></p-button>
          <p-button label="Update" (click)="onSave()" styleClass="p-button-primary"></p-button>
        </div>
      </div>
    </app-nex-dialog>
  `,
})
export class ProfileEditDialogComponent {
  @Input() visible = false;
  @Input() form!: FormGroup;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSave() {
    this.save.emit();
  }
}
