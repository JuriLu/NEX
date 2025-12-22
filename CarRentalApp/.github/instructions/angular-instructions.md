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
