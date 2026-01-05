## API Contracts

- Backend defines canonical DTOs
- Frontend mirrors DTOs exactly
- No guessing API shapes
- Version breaking API changes

## Naming

- Same naming conventions FE ↔ BE
- Avoid transformation layers unless necessary

## Validation Strategy

- Backend is source of truth
- Frontend validates UX only
- Never trust frontend data

## Auth & Security

- Frontend never infers permissions
- Backend enforces all access rules
