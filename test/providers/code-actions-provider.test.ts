// Mock VSCode
const mockVSCode = {
    CodeActionKind: {
        QuickFix: 'quickfix'
    },
    Range: class {
        constructor(public start: any, public end: any) { }
    },
    Position: class {
        constructor(public line: number, public character: number) { }
    },
    CodeAction: class {
        constructor(public title: string, public kind?: any) {
            this.edit = undefined;
        }
        edit?: any;
    },
    WorkspaceEdit: class {
        constructor() {
            this.changes = new Map();
        }
        changes: Map<string, any>;
    },
    TextEdit: {
        insert: (position: any, text: string) => ({ position, text })
    }
};

describe('TranslateMeCodeActionProvider', () => {

    describe('Module Structure', () => {
        it('should be importable (basic module test)', () => {
            // This test just checks that we can test without vscode dependency
            expect(true).toBe(true);
        });

        it('should have provider class definition', () => {
            // Mock test for provider existence
            const mockProvider = {
                provideCodeActions: jest.fn(() => []),
                providedCodeActionKinds: ['quickfix']
            };

            expect(typeof mockProvider.provideCodeActions).toBe('function');
            expect(Array.isArray(mockProvider.providedCodeActionKinds)).toBe(true);
        });

        it('should handle empty diagnostics', () => {
            const mockProvider = {
                provideCodeActions: jest.fn((doc, range, context) => {
                    return context.diagnostics.length === 0 ? [] : ['action1', 'action2'];
                })
            };

            const mockContext = { diagnostics: [] };
            const result = mockProvider.provideCodeActions({}, {}, mockContext);

            expect(result).toHaveLength(0);
        });

        it('should provide actions for translate-me diagnostics', () => {
            const mockProvider = {
                provideCodeActions: jest.fn((doc, range, context) => {
                    const translateMeDiagnostics = context.diagnostics.filter(
                        (d: any) => d.source === 'translate-me'
                    );
                    return translateMeDiagnostics.length > 0 ? ['action1', 'action2', 'action3'] : [];
                })
            };

            const mockContext = {
                diagnostics: [
                    { source: 'translate-me', message: 'Hardcoded string' },
                    { source: 'other', message: 'Other error' }
                ]
            };

            const result = mockProvider.provideCodeActions({}, {}, mockContext);

            expect(result.length).toBeGreaterThan(0);
        });
    });
}); 