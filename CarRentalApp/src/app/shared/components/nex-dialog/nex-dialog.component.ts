import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-nex-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [header]="header"
      [modal]="true"
      styleClass="mbux-premium-dialog"
      [style]="{ width: width }"
      appendTo="body"
      (onHide)="onHide.emit()"
    >
      <ng-content select="[body]"></ng-content>
      
      <ng-template pTemplate="footer">
        <ng-content select="[footer]"></ng-content>
      </ng-template>
    </p-dialog>
  `,
  styles: []
})
export class NexDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  @Input() header = '';
  @Input() width = '550px';
  
  @Output() onHide = new EventEmitter<void>();

  // Helper to handle two-way binding manually if needed, 
  // though [(visible)] on p-dialog usually handles it via the getter/setter or ngOnChanges.
  // But since we wrap it, we need to sync back to parent.
  // Actually, p-dialog [(visible)] writes to our 'visible' input.
  // We need to emit changes back.
  
  // Better approach for two-way binding in wrapper:
  // p-dialog updates 'visible'. We catch that change and emit visibleChange.
  // However, p-dialog modifies the variable directly if bound. 
  // Let's use a setter/getter approach or ngModel if we want to be fancy, 
  // but simple event binding is easier:
  // [(visible)]="visible" inside the template means when p-dialog closes, it sets this.visible = false.
  // We need to intercept that or wait for it.
  // Actually, p-dialog (visibleChange) emits. we should forward it.
}
