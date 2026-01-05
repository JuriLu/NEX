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

## Project Context

- Latest Angular version (use standalone components by default)
- TypeScript for type safety
- Angular CLI for project setup and scaffolding
- Follow Angular Style Guide (https://angular.dev/style-guide)
- Use Angular Material or other modern UI libraries for consistent styling (if specified)

# Development Standards

## Architecture

- Use standalone components unless modules are explicitly required
- Organize code by standalone feature modules or domains for scalability
- Implement lazy loading for feature modules to optimize performance
- Use Angular's built-in dependency injection system effectively
- Structure components with a clear separation of concerns (smart vs. presentational components)

## TypeScript

- Enable strict mode in tsconfig.json for type safety
- Define clear interfaces and types for components, services, and models
- Use type guards and union types for robust type checking
- Implement proper error handling with RxJS operators (e.g., catchError)
- Use typed forms (e.g., FormGroup, FormControl) for reactive forms

## Component Design

- Follow Angular's component lifecycle hooks best practices
- When using Angular >= 19, Use input() output(), viewChild(), viewChildren(), contentChild() and contentChildren() functions instead of decorators; otherwise use decorators
- Leverage Angular's change detection strategy (default or OnPush for performance)
- Keep templates clean and logic in component classes or services
- Use Angular directives and pipes for reusable functionality

## Styling

- Use Angular's component-level CSS encapsulation (default: ViewEncapsulation.Emulated)
- Prefer SCSS for styling with consistent theming
- Implement responsive design using CSS Grid, Flexbox, or Angular CDK Layout utilities
- Follow Angular Material's theming guidelines if used
- Maintain accessibility (a11y) with ARIA attributes and semantic HTML

## State Management

- Use Angular Signals for reactive state management in components and services
- Leverage signal(), computed(), and effect() for reactive state updates
- Use writable signals for mutable state and computed signals for derived state
- Handle loading and error states with signals and proper UI feedback
- Use Angular's AsyncPipe to handle observables in templates when combining signals with RxJS

## Data Fetching

- Use Angular's HttpClient for API calls with proper typing
- Implement RxJS operators for data transformation and error handling
- Use Angular's inject() function for dependency injection in standalone components
- Implement caching strategies (e.g., shareReplay for observables)
- Store API response data in signals for reactive updates
- Handle API errors with global interceptors for consistent error handling

## Security

- Implement route guards for authentication and authorization
- Use Angular's HttpInterceptor for CSRF protection and API authentication headers
- Validate form inputs with Angular's reactive forms and custom validators
- Follow Angular's security best practices (e.g., avoid direct DOM manipulation)

## Performance

- Enable production builds with ng build --prod for optimization
- Use lazy loading for routes to reduce initial bundle size
- Optimize change detection with OnPush strategy and signals for fine-grained reactivity
- Use trackBy in ngFor loops to improve rendering performance
- Implement server-side rendering (SSR) or static site generation (SSG) with Angular Universal (if specified)

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
- One component per file
- Feature-based folders
- Avoid shared modules dumping grounds
- **Component Naming**: Ensure all component files (TS, HTML, SCSS) follow the `[name].component.[ext]` convention. For example, use `navbar.component.scss` instead of `navbar.scss`.
- Use standalone components by default
- Smart vs dumb component separation
- No business logic in templates
- No subscriptions in components unless justified
- Prefer async pipe

## RxJS

- Prefer higher-order mapping operators
- Avoid nested subscriptions
- Use takeUntilDestroyed or equivalent
- Side effects belong in effects/services, not components

## State Management

- State is immutable
- No direct mutation
- Selectors must be pure
- Avoid storing derived state

## Change Detection

- OnPush by default
- Avoid functions in templates
- Use pure pipes

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
