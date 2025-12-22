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