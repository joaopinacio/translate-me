import { EventEmitter } from 'events';

// Mock VSCode API
export const vscode = {
    Diagnostic: class {
        constructor(public range: any, public message: string, public severity: any) { }
    },

    DiagnosticSeverity: {
        Error: 0,
        Warning: 1,
        Information: 2,
        Hint: 3
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
            this.command = undefined;
        }
        edit?: any;
        command?: any;
    },

    CodeActionKind: {
        QuickFix: 'quickfix'
    },

    WorkspaceEdit: class {
        constructor() {
            this.changes = new Map();
        }
        changes: Map<string, any>;
        set(uri: any, edits: any) {
            this.changes.set(uri, edits);
        }
    },

    TextEdit: {
        insert: (position: any, text: string) => ({ range: { start: position, end: position }, newText: text })
    },

    Uri: {
        file: (path: string) => ({ fsPath: path, toString: () => path })
    },

    workspace: {
        getConfiguration: jest.fn(() => ({
            get: jest.fn()
        })),
        workspaceFolders: [
            {
                uri: { fsPath: '/test/workspace' },
                name: 'test-workspace'
            }
        ]
    },

    window: {
        showErrorMessage: jest.fn(),
        showWarningMessage: jest.fn(),
        showInformationMessage: jest.fn()
    },

    languages: {
        createDiagnosticCollection: jest.fn(() => ({
            clear: jest.fn(),
            set: jest.fn(),
            dispose: jest.fn()
        })),
        registerCodeActionsProvider: jest.fn()
    },

    commands: {
        registerCommand: jest.fn()
    }
};

// Mock filesystem
export const mockFs = {
    readFileSync: jest.fn(),
    existsSync: jest.fn(),
    statSync: jest.fn()
};

// Mock globby
export const mockGlobby = jest.fn();

// Setup global mocks
(global as any).vscode = vscode;

export default vscode; 