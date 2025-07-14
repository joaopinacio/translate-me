/**
 * Tests for extension.ts - VS Code Extension Entry Point
 */

// Mock VS Code API
jest.mock('vscode', () => ({
    languages: {
        createDiagnosticCollection: jest.fn(),
        registerCodeActionsProvider: jest.fn(),
    },
    window: {
        showInformationMessage: jest.fn(),
        activeTextEditor: undefined,
    },
    workspace: {
        onDidSaveTextDocument: jest.fn(),
        onDidChangeTextDocument: jest.fn(),
        getWorkspaceFolder: jest.fn(),
    },
    commands: {
        registerCommand: jest.fn(),
    },
    DiagnosticSeverity: {
        Warning: 1,
    },
    Range: jest.fn(),
    Position: jest.fn(),
    Diagnostic: jest.fn(),
    CodeActionKind: {
        QuickFix: 'quickfix',
    },
    CodeAction: jest.fn(),
    Uri: {
        file: jest.fn(),
        parse: jest.fn(),
    },
    TextDocument: jest.fn(),
    TextDocumentChangeEvent: jest.fn(),
    ExtensionContext: jest.fn(),
}), { virtual: true });

import * as vscode from 'vscode';
import { activate, deactivate } from '../src/extension';

// Mock the scanner and provider
jest.mock('../src/services/workspace-scanner', () => ({
    WorkspaceScanner: jest.fn().mockImplementation(() => ({
        scanWorkspace: jest.fn().mockResolvedValue([]),
        scanFile: jest.fn().mockResolvedValue([]),
    })),
}));

jest.mock('../src/providers/code-actions-provider', () => ({
    TranslateMeCodeActionProvider: jest.fn().mockImplementation(() => ({
        provideCodeActions: jest.fn(),
    })),
}));

// Add static property to the mocked class
const mockTranslateMeCodeActionProvider = require('../src/providers/code-actions-provider').TranslateMeCodeActionProvider;
mockTranslateMeCodeActionProvider.providedCodeActionKinds = ['quickfix'];

describe('Extension', () => {
    let mockContext: any;
    let mockDiagnosticCollection: any;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock diagnostic collection
        mockDiagnosticCollection = {
            clear: jest.fn(),
            dispose: jest.fn(),
            set: jest.fn(),
        };

        // Mock VS Code API returns
        (vscode.languages.createDiagnosticCollection as jest.Mock).mockReturnValue(mockDiagnosticCollection);
        (vscode.commands.registerCommand as jest.Mock).mockReturnValue({ dispose: jest.fn() });
        (vscode.languages.registerCodeActionsProvider as jest.Mock).mockReturnValue({ dispose: jest.fn() });
        (vscode.workspace.onDidSaveTextDocument as jest.Mock).mockReturnValue({ dispose: jest.fn() });
        (vscode.workspace.onDidChangeTextDocument as jest.Mock).mockReturnValue({ dispose: jest.fn() });

        // Create mock context
        mockContext = {
            subscriptions: [],
        };
    });

    describe('activate', () => {
        it('should create diagnostic collection with correct name', async () => {
            await activate(mockContext);

            expect(vscode.languages.createDiagnosticCollection).toHaveBeenCalledWith('translate-me');
            expect(mockContext.subscriptions).toContain(mockDiagnosticCollection);
        });

        it('should register code action provider', async () => {
            await activate(mockContext);

            expect(vscode.languages.registerCodeActionsProvider).toHaveBeenCalledWith(
                { language: 'dart' },
                expect.any(Object),
                {
                    providedCodeActionKinds: ['quickfix'],
                }
            );
        });

        it('should register commands', async () => {
            await activate(mockContext);

            expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
                'translate-me.scan',
                expect.any(Function)
            );
            expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
                'translate-me.toggle',
                expect.any(Function)
            );
        });

        it('should register event listeners', async () => {
            await activate(mockContext);

            expect(vscode.workspace.onDidSaveTextDocument).toHaveBeenCalledWith(expect.any(Function));
            expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should add all subscriptions to context', async () => {
            await activate(mockContext);

            expect(mockContext.subscriptions.length).toBeGreaterThan(0);
        });
    });

    describe('deactivate', () => {
        it('should handle undefined diagnostic collection gracefully', () => {
            // Should not throw when diagnostic collection is undefined
            expect(() => deactivate()).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should complete activation process without errors', async () => {
            await expect(activate(mockContext)).resolves.not.toThrow();
        });

        it('should set up all required components', async () => {
            await activate(mockContext);

            // Verify diagnostic collection was created
            expect(vscode.languages.createDiagnosticCollection).toHaveBeenCalled();

            // Verify code actions provider was registered
            expect(vscode.languages.registerCodeActionsProvider).toHaveBeenCalled();

            // Verify commands were registered
            expect(vscode.commands.registerCommand).toHaveBeenCalledTimes(2);

            // Verify event listeners were registered
            expect(vscode.workspace.onDidSaveTextDocument).toHaveBeenCalled();
            expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalled();
        });
    });

    describe('Command Registration', () => {
        it('should register scan command', async () => {
            await activate(mockContext);

            const registerCommandCalls = (vscode.commands.registerCommand as jest.Mock).mock.calls;
            const scanCommandCall = registerCommandCalls.find(call => call[0] === 'translate-me.scan');

            expect(scanCommandCall).toBeDefined();
            expect(typeof scanCommandCall[1]).toBe('function');
        });

        it('should register toggle command', async () => {
            await activate(mockContext);

            const registerCommandCalls = (vscode.commands.registerCommand as jest.Mock).mock.calls;
            const toggleCommandCall = registerCommandCalls.find(call => call[0] === 'translate-me.toggle');

            expect(toggleCommandCall).toBeDefined();
            expect(typeof toggleCommandCall[1]).toBe('function');
        });
    });

    describe('Event Listener Registration', () => {
        it('should register document save listener', async () => {
            await activate(mockContext);

            expect(vscode.workspace.onDidSaveTextDocument).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should register document change listener', async () => {
            await activate(mockContext);

            expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalledWith(expect.any(Function));
        });
    });

    describe('Extension Configuration', () => {
        it('should use correct language for code actions', async () => {
            await activate(mockContext);

            expect(vscode.languages.registerCodeActionsProvider).toHaveBeenCalledWith(
                { language: 'dart' },
                expect.any(Object),
                expect.any(Object)
            );
        });

        it('should provide correct code action kinds', async () => {
            await activate(mockContext);

            expect(vscode.languages.registerCodeActionsProvider).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                { providedCodeActionKinds: ['quickfix'] }
            );
        });
    });
}); 