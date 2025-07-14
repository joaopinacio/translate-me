# Test Structure - Translate Me

This directory contains all unit tests for the VS Code extension "translate-me" project.

## Folder Structure

```
test/
├── utils/                     # Tests for utility functions
│   ├── filters.test.ts       # Tests for string filters
│   └── position.test.ts      # Tests for position calculations
├── detectors/                # Tests for detectors
│   ├── string-detector.test.ts   # Tests for string detector
│   └── widget-detector.test.ts   # Tests for widget detector
├── parsers/                  # Tests for parsers
│   └── comment-parser.test.ts    # Tests for comment parser
├── core/                     # Tests for core functionality
│   └── hardcoded-string-detector.test.ts  # Tests for main detector
├── services/                 # Tests for services
│   └── workspace-scanner.test.ts  # Tests for workspace scanner
├── providers/                # Tests for VSCode providers
│   └── code-actions-provider.test.ts  # Tests for Code Actions
├── mocks/                    # Mocks for tests
│   └── vscode-mock.ts        # VSCode API mock
├── setup.ts                  # Global test setup
├── run-all-tests.js          # Script to run all tests
└── README.md                 # This file
```

## Configuration

### Test Dependencies

- **Jest** - Testing framework
- **@types/jest** - TypeScript types for Jest
- **ts-jest** - TypeScript preset for Jest

### Configuration Files

- `jest.config.js` - Jest configuration
- `tsconfig.test.json` - TypeScript configuration for tests
- `test/setup.ts` - Global test setup

## Running Tests

### Available Commands

```bash
# Run all tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage
npm run test:unit:coverage

# Run custom script
node test/run-all-tests.js
```

### Individual Execution

```bash
# Run specific test
npx jest test/utils/filters.test.ts

# Run tests from a folder
npx jest test/utils/
```

## Test Structure

### Naming Convention

- Test files: `*.test.ts`
- Describe blocks: Module/functionality name
- Test cases: Clear description of expected behavior

### Structure Example

```typescript
import { functionName } from '../../src/module/file';

describe('Module Name', () => {
  
  describe('functionName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe('expected output');
    });

    it('should handle edge case', () => {
      // Test edge cases
    });
  });
});
```

## Mocks and Utilities

### VSCode Mock

The `mocks/vscode-mock.ts` file contains mocks for VSCode API:

- Diagnostic
- DiagnosticSeverity
- Range, Position
- CodeAction, CodeActionKind
- WorkspaceEdit, TextEdit
- Uri, workspace, window
- languages, commands

### Global Setup

The `setup.ts` file configures:

- Global mocks
- Cleanup between tests
- Test environment specific settings

## Test Coverage

### Tested Modules

- ✅ `utils/filters.ts` - String filters
- ✅ `utils/position.ts` - Position calculations
- ✅ `detectors/string-detector.ts` - String detector
- ✅ `detectors/widget-detector.ts` - Widget detector
- ✅ `parsers/comment-parser.ts` - Comment parser
- ✅ `core/hardcoded-string-detector.ts` - Main detector

### Focus Areas

1. **String Detection**: Different types of strings and contexts
2. **Filters**: Validation of filters to avoid false positives
3. **Positioning**: Correct line and column calculations
4. **Ignore Comments**: Correct parsing of comments
5. **Widgets**: Detection of known and custom widgets

## Best Practices

### Unit Tests

- Test one specific functionality at a time
- Use AAA pattern (Arrange, Act, Assert)
- Test success and failure cases
- Test edge cases and invalid inputs

### Assertions

```typescript
// Check types
expect(typeof result).toBe('string');

// Check arrays
expect(Array.isArray(result)).toBe(true);
expect(result).toHaveLength(2);

// Check objects
expect(result).toHaveProperty('content');
expect(result).toEqual({ content: 'Hello' });

// Check strings
expect(result).toContain('Hello');
expect(result).toMatch(/pattern/);
```

### Data Structures

```typescript
// Use correct interfaces
const match: StringMatch = {
  content: 'Hello World',
  startLine: 0,
  startCol: 5,
  endLine: 0,
  endCol: 16,
  widget: 'Text',
  parameter: 'text'
};

const ignoreRule: IgnoreRule = {
  type: 'line',
  startLine: 1,
  endLine: 1
};
```

## Troubleshooting

### Common Issues

1. **Linter Errors**: Check if functions are exported correctly
2. **Type Errors**: Use correct interfaces from `types.ts`
3. **Mock Failures**: Check if mocks are configured in `setup.ts`
4. **Import Errors**: Check relative paths in imports

### Debug

```bash
# Run with detailed logs
npx jest --verbose

# Run specific test
npx jest -t "should handle empty content"

# Watch mode for development
npm run test:unit:watch
```

---

📝 **Note**: This test structure was created to cover all main functionalities of the translate-me project, following testing best practices and maintaining the modular architecture of the main code. 