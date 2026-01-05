import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NexDialogComponent } from '../../../../shared/components/nex-dialog/nex-dialog.component';
import { NexFormFieldComponent } from '../../../../shared/components/nex-form-field/nex-form-field.component';

@Component({
  selector: 'app-profile-password-dialog',
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
    <app-nex-dialog
      [visible]="visible"
      header="Security Protocol"
      width="500px"
      (onHide)="onCancel()"
    >
      <div body>
        <form [formGroup]="form" class="flex flex-column gap-3 mt-2">
          <app-nex-form-field label="Current Master Key" [control]="form.get('currentPassword')">
            <input
              type="password"
              pInputText
              formControlName="currentPassword"
              class="mbux-input w-full"
              autocomplete="new-password"
            />
          </app-nex-form-field>

          <app-nex-form-field label="New Master Key" [control]="form.get('newPassword')">
            <input
              type="password"
              pInputText
              formControlName="newPassword"
              class="mbux-input w-full"
              autocomplete="new-password"
            />
          </app-nex-form-field>

          <app-nex-form-field label="Confirm New Key" [control]="form.get('confirmPassword')">
            <input
              type="password"
              pInputText
              formControlName="confirmPassword"
              class="mbux-input w-full"
              autocomplete="new-password"
            />
          </app-nex-form-field>
        </form>
      </div>
      <div footer>
        <div class="mbux-dialog-footer">
          <p-button label="Abort" (click)="onCancel()" styleClass="p-button-text"></p-button>
          <p-button
            label="Change Key"
            (click)="onUpdate()"
            styleClass="p-button-primary"
          ></p-button>
        </div>
      </div>
    </app-nex-dialog>
  `,
})
export class ProfilePasswordDialogComponent {
  @Input() visible = false;
  @Input() form!: FormGroup;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<void>();

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onUpdate() {
    this.update.emit();
  }
}
