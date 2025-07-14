/**
 * Workspace scanning service
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import globby from 'globby';

import { KNOWN_WIDGET_PATTERNS } from '../constants';
import { findHardcodedStrings } from '../core/hardcoded-string-detector';

export class WorkspaceScanner {
    constructor(private diagnosticCollection: vscode.DiagnosticCollection) { }

    /**
     * Scans the workspace for hardcoded strings
     */
    async scanWorkspace(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;

        const rootPath = workspaceFolders[0].uri.fsPath;
        const dartFiles = await this.findDartFiles(rootPath);

        this.diagnosticCollection.clear();

        for (const file of dartFiles) {
            await this.processFile(file);
        }
    }

    /**
     * Scans a single file for hardcoded strings
     */
    async scanFile(document: vscode.TextDocument): Promise<void> {
        try {
            const content = document.getText();
            const matches = findHardcodedStrings(content, KNOWN_WIDGET_PATTERNS);

            if (matches.length > 0) {
                const diagnostics = this.createDiagnostics(matches);
                this.diagnosticCollection.set(document.uri, diagnostics);
            } else {
                // Clear diagnostics if no matches found
                this.diagnosticCollection.delete(document.uri);
            }
        } catch (error) {
            console.error(`Error processing document ${document.uri.fsPath}:`, error);
        }
    }

    /**
     * Processes a single file for hardcoded strings
     */
    private async processFile(filePath: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = findHardcodedStrings(content, KNOWN_WIDGET_PATTERNS);

            if (matches.length > 0) {
                const diagnostics = this.createDiagnostics(matches);
                this.diagnosticCollection.set(vscode.Uri.file(filePath), diagnostics);
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }

    /**
     * Creates VS Code diagnostics from string matches
     */
    private createDiagnostics(matches: any[]): vscode.Diagnostic[] {
        return matches.map(match => {
            const range = new vscode.Range(
                new vscode.Position(match.startLine, match.startCol),
                new vscode.Position(match.endLine, match.endCol)
            );

            const parameterInfo = match.parameter ? `(${match.parameter})` : '';
            const message = `Hardcoded string detected in ${match.widget}${parameterInfo}. Consider using a translation.`;

            return {
                severity: vscode.DiagnosticSeverity.Warning,
                message,
                range,
                source: 'translate-me',
                code: 'hardcoded-string',
            };
        });
    }

    /**
     * Finds all .dart files in the workspace (excluding test files)
     */
    private async findDartFiles(rootPath: string): Promise<string[]> {
        return globby(['**/*.dart', '!**/*_test.dart'], {
            cwd: rootPath,
            gitignore: true,
            absolute: true,
        });
    }
} 