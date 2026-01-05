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

# Angular Guidelines

## Project Structure

- Use **feature-based** architecture (one feature per directory).
- Implement **lazy loading** for feature modules.
- Use **named routes** for navigation.
- Use **named outlets** for multiple views.
- Follow Angular naming conventions for files and directories.
- **Component Naming**: Ensure all component files (TS, HTML, SCSS) follow the `[name].component.[ext]` convention. For example, use `navbar.component.scss` instead of `navbar.scss`.

## Coding Guidelines

- Apply **DRY, KISS, YAGNI, SOLID** principles.
- Follow consistent **naming conventions** across the entire codebase (see project-specific rules in the custom-template file).
- Keep code modular, loosely coupled, and easily testable.
- Avoid anti-patterns (spaghetti code, god object, lava flow) unless absolutely unavoidable.
- Write comments only for the **why**, not the **what**.
- Handle errors and exceptions with clear messages and safe logging.

## Form Security and Validation

- **Input Sanitization**: Always use `SecurityUtils.sanitizeObject()` before sending form data to services to prevent XSS and injection attacks.
- **Regex Validation**:
  - For **Names/Brands**: Use `Validators.pattern(/^[a-zA-Z\s-]+$/)` to prevent special characters and numbers.
  - For **Alpha-numeric** (Models/IDs): Use `Validators.pattern(/^[a-zA-Z0-9\s-]+$/)`.
- **UX/UI**:
  - Display validation warnings when a field is `invalid` AND (`touched` OR `submitted`).
  - Use the premium "Sunburn to Purple" gradient style for validation warnings.
- **SQL/Script Injection**: Never trust user input. Treat all form values as raw data, not executable code.

## Angular + Snyk Security Cooperation

- **Angular InnerHTML**: Avoid using `[innerHTML]` unless absolutely necessary. If used, the value MUST be sanitized via Angular's `DomSanitizer`.
- **Content Security Policy (CSP)**: Maintain the CSP meta tag in `index.html` to mitigate XSS and data injection risks (Snyk recommendation).
- **Dependency Audit**: Regularly run `npm audit` or use Snyk's CLI to identify vulnerable packages.
- **Context-Aware Encoding**: Rely on Angular's built-in interpolation `{{ }}` and property binding `[ ]` which automatically encode data to prevent script execution.
- **Strict URI Schemes**: Use `SecurityUtils` to strip out dangerous schemes like `javascript:` and non-image `data:` URIs.
