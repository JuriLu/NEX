# Develop Guidelines

## Coding Guidelines
- Apply **DRY, KISS, YAGNI, SOLID** principles.
- Follow consistent **naming conventions** across the entire codebase (see project-specific rules in the custom-template file).
- Keep code modular, loosely coupled, and easily testable.
- Avoid anti-patterns (spaghetti code, god object, lava flow) unless absolutely unavoidable.
- Write comments only for the **why**, not the **what**.
- Handle errors and exceptions with clear messages and safe logging.
- Since we are using angular project, use the guideline from instructions/angular-instructions.md file

## API Development
- Default → **RESTful APIs** (use GraphQL only if explicitly required).
- Document APIs with **OpenAPI/Swagger**.
- Each endpoint must include:
  - Input/output validation
  - Consistent error handling
  - Proper logging
- Maintain backward compatibility for public APIs.
- Ensure automated API testing (Postman collections or equivalent).

## Testing
- Unit tests are mandatory for each module.
- Follow the **AAA pattern** (Arrange, Act, Assert).
- Tests must be isolated and independent, using mocks/stubs for external dependencies.
- Use descriptive test names.
- Provide integration tests and, when required, end-to-end tests.
- Target test coverage: ≥ 80–90%.
- All tests must run in the CI/CD pipeline and generate:
  - Coverage reports
  - Execution reports
- Integrate reports into **SonarQube** for quality analysis.

## Documentation Policies
- **Mandatory Documentation**: Every change must be recorded to maintain project integrity.
- **Coding Changes**: All logic, state management (NgRx), or architectural changes must be documented in `.github/documentation/Coding-Documentation.md`.
- **UI/UX Changes**: All design, aesthetic, animation, and branding modifications must be documented in `.github/documentation/UI-UX-Documentation.md`.
- **Refinement**: Ensure both documents are synchronized with the codebase after every implementation step.

## Revision History

| Version | Date       | Author | Description                     |
|---------|------------|--------|---------------------------------|
| 1.0     | 2025-10-03 | Initial| First draft                     |

---