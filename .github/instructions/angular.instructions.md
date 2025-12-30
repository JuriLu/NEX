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

## Component Guidelines

### Component Decomposition

- **Smaller Components**: Split large page components into smaller, specialized sub-components (e.g., Dialogs, Forms, List items).
- **Colocation**: Place these page-specific sub-components in a `components` subfolder within the page's feature folder. Do not put them in `shared` unless they are truly global.
  - _Example_: `src/app/features/admin/car-management/components/car-upsert-dialog/`

### Data-Driven Tables

- **Headers**: Define table columns in the component class (TypeScript) as an array of objects.
- **Rendering**: Use `@for` to iterate over these column definitions in the template to render table headers.
- **Validation**: Ensure strong typing for column definitions.

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
