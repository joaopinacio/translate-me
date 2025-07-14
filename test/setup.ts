// Global setup for tests
beforeEach(() => {
    jest.clearAllMocks();
});

// Mock modules (vscode is mocked individually in test files that need it)
jest.mock('fs', () => require('./mocks/vscode-mock').mockFs);
jest.mock('globby', () => require('./mocks/vscode-mock').mockGlobby);
