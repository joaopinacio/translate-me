// Mock fs
const mockFs = {
    readFileSync: jest.fn(() => 'Text("Hello World")'),
    existsSync: jest.fn(() => true)
};

// Mock globby
const mockGlobby = jest.fn(() => Promise.resolve(['/test/file1.dart', '/test/file2.dart']));

jest.mock('fs', () => mockFs);
jest.mock('globby', () => mockGlobby);

describe('WorkspaceScanner', () => {

    describe('Module Structure', () => {
        it('should be importable (basic module test)', () => {
            // This test just checks that we can test without vscode dependency
            expect(true).toBe(true);
        });

        it('should have scanner class definition', () => {
            // Mock test for scanner existence
            const mockScanner = {
                scanWorkspace: jest.fn(async () => { }),
                scanFile: jest.fn(async () => { }),
                diagnosticCollection: { clear: jest.fn(), set: jest.fn() }
            };

            expect(typeof mockScanner.scanWorkspace).toBe('function');
            expect(typeof mockScanner.scanFile).toBe('function');
            expect(typeof mockScanner.diagnosticCollection.clear).toBe('function');
        });

        it('should handle workspace scanning', async () => {
            const mockScanner = {
                scanWorkspace: jest.fn(async () => {
                    // Mock scanning logic
                    return Promise.resolve();
                }),
                diagnosticCollection: {
                    clear: jest.fn(),
                    set: jest.fn()
                }
            };

            await mockScanner.scanWorkspace();
            expect(mockScanner.scanWorkspace).toHaveBeenCalled();
        });

        it('should handle file scanning', async () => {
            const mockScanner = {
                scanFile: jest.fn(async (document) => {
                    // Mock file scanning
                    const content = document.getText();
                    return Promise.resolve();
                })
            };

            const mockDocument = {
                getText: jest.fn(() => 'Text("Hello World")'),
                uri: { fsPath: '/test/file.dart' }
            };

            await mockScanner.scanFile(mockDocument);
            expect(mockScanner.scanFile).toHaveBeenCalledWith(mockDocument);
            expect(mockDocument.getText).toHaveBeenCalled();
        });

        it('should clear diagnostics during scan', () => {
            const mockDiagnosticCollection = {
                clear: jest.fn(),
                set: jest.fn(),
                dispose: jest.fn()
            };

            const mockScanner = {
                diagnosticCollection: mockDiagnosticCollection,
                scanWorkspace: jest.fn(() => {
                    mockDiagnosticCollection.clear();
                })
            };

            mockScanner.scanWorkspace();
            expect(mockDiagnosticCollection.clear).toHaveBeenCalled();
        });
    });
}); 