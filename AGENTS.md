## Commands

```bash
npm run dev      # Development server
npm run build    # Compile to dist/
npm run start    # Run production build
npm run check    # Biome format + organize imports
npm run check2   # Biome check with unsafe fixes
npm run lint     # ESLint
npm run lint2    # Biome lint
npm run format   # Biome format
```

## Required Order

`npm run check2` → `npm run lint` before committing.

## Stack

- Next.js 16 (App Router), React 19, JavaScript (ES6+)
- Tailwind CSS v4, shadcn/ui, Radix UI
- Mongoose (for Next.js API routes)
- Biome + ESLint for linting/formatting

## Code Rules

## General Development

- When unsure about implementation details, read relevant source files before proposing changes.
- Never modify generated files in `dist/` or `build/` directories.
- Avoid unnecessary object copying or cloning.
- Avoid deep nesting; return early.
- Use appropriate concurrency control mechanisms.
- Prefer built-in Node.js modules when possible.
- Use npm for package management.
- Pin exact versions in package.json for production dependencies.

## Code Style

- Use JavaScript (ES6+) for all new files.
- Follow existing naming conventions in the codebase.
- Use named exports, not default exports.
- Use ES6+ features (arrow functions, destructuring).
- Async/await over promises.
- Template literals for string interpolation.
- Minimal comments - code should be self-documenting.
- Short, focused functions (< 20 lines).
- Avoid unnecessary abstractions.

### Naming Conventions

- Use meaningful, descriptive names.
- Follow project or language naming standards.
- Avoid abbreviations and single-letter variables (except `i` in loops).

### Code Organization

- One component per file.
- Group related code together.
- Each function should do only one thing.
- Maintain appropriate levels of abstraction.
- Organize imports: external, internal, types.
- Components in `src/components/`, Hooks in `src/hooks/`, Utils in `src/utils/`.

## Frontend Components (React)

- Use functional components with hooks.
- Extract reusable logic into custom React hooks.
- Define prop types using PropTypes or TypeScript (if using TS).
- Follow established folder structure in `src/components/`.
- Co-locate styles in module CSS file next to component.
- Keep components under 200 lines. Extract subcomponents when file grows beyond.
- Prefer composition over prop drilling.
- React components layout: Props interface → Component → Styles.
- Use Tailwind CSS for styling.
- Follow component naming conventions.

### Code Review

- Flag potential performance issues.
- Suggest security improvements.

## PR Instructions

- Follow required title format.
- Check pre-commit checklist before submitting.
- Adhere to review guidelines.

## Security

- Never log sensitive data (passwords, tokens, PII).
- Never commit secrets or keys to the repository.
- Follow security best practices in all code.
- Parameterized queries only (prevent SQL injection).
- Validate and sanitize all inputs.

## Performance Optimization

### Memory

- Avoid unnecessary object creation.
- Release resources that are no longer needed in a timely manner.
- Pay attention to memory leak issues.

### Computation

- Avoid redundant calculations.
- Use appropriate data structures and algorithms.
- Defer computation until necessary.

### Parallel

- Identify tasks that can be parallelized.
- Avoid unnecessary synchronization.
- Pay attention to thread safety issues.

## Testing

- Write unit tests for all new functions.
- Maintain test coverage above 80%.
- Use Jest for testing framework.
- Jest + React Testing Library for component tests.
- Include test cases for edge conditions.
- Test all user interactions.
- Test success and error cases.
- Unit tests required for business logic.
- Integration tests for API endpoints.
- E2E tests for critical user flows.
- Use descriptive test names: "should [expected behavior] when [condition]".
- One assertion per test when possible.
- Mock external dependencies, not internal modules.
- Use factories for test data, not fixtures.

## Documentation

- Include usage examples in component documentation.
- No verbose documentation unless requested.
- Update relevant docs when modifying features.
- Keep README.md in sync with new capabilities.
- Use sentence case for headings.
- Include code examples for all features.
- Keep paragraphs short (3-4 sentences max).
- Link to related documentation.
- Write comments in Vietnamese.
- Documentation in Vietnamese.

## Communication

- Always respond in Vietnamese.
- Use technical English terms when no Vietnamese equivalent exists.
- Provide explanations before showing code.
- Provide brief explanations.
- Highlight breaking changes explicitly.
- Reply in a concise style. Avoid unnecessary repetition or filler language.

## App Analysis

- When asked to analyze the app:
  1. Run dev server with `npm run dev`
  2. Fetch logs from console
  3. Suggest performance improvements

## Documentation Generation

- Extract code comments.
- Analyze `README.md`.
- Generate markdown documentation.