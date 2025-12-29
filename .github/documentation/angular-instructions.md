# Angular Instructions

## Control Flow Syntax

**Always use modern Angular control flow syntax (`@if`, `@for`, `@switch`) instead of deprecated `*ngIf`, `*ngFor`, `*ngSwitch`.**

### Examples:

**@if**

```html
@if (isVisible) {
<div>Content</div>
} @else {
<div>Fallback</div>
}
```

**@for**

```html
@for (item of items; track item.id) {
<div>{{ item.name }}</div>
} @empty {
<div>No items</div>
}
```

## Shared Components

### Nex Dialog

Use `app-nex-dialog` for all dialogs to ensure consistent styling (MBUX).

**Usage:**

```html
<app-nex-dialog
  [(visible)]="displayDialog"
  header="Dialog Header"
  width="550px"
  (onHide)="hideDialog()"
>
  <div body>
    <!-- Content here -->
  </div>
  <div footer>
    <!-- Buttons here -->
  </div>
</app-nex-dialog>
```

### Nex Form Field

Use `app-nex-form-field` to wrap form inputs. It handles label rendering and standard validation error messages.

**Usage:**

```html
<app-nex-form-field
  label="Username"
  [control]="form.get('username')"
  inputId="username"
>
  <input pInputText formControlName="username" id="username" />
</app-nex-form-field>
```

## Styling

- Use `ngClass` for conditional class application.
- Avoid deprecated PrimeNG properties like `responsiveLayout="scroll"` on tables; use CSS or modern alternatives.
- Use `[paginator]="true"` for tables.
