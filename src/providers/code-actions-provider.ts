/**
 * Code Actions Provider for ignore functionality
 */

import * as vscode from 'vscode';
import { EXTENSION_NAME, IGNORE_COMMENTS } from '../constants';

export class TranslateMeCodeActionProvider implements vscode.CodeActionProvider {

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    /**
     * Provides code actions for translate-me diagnostics
     */
    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {

        // Only provide actions for our diagnostics
        const translateMeDiagnostics = context.diagnostics.filter(
            diagnostic => diagnostic.source === EXTENSION_NAME
        );

        if (translateMeDiagnostics.length === 0) {
            return [];
        }

        const actions: vscode.CodeAction[] = [];
        let fileIgnoreActionAdded = false;

        for (const diagnostic of translateMeDiagnostics) {
            const line = diagnostic.range.start.line;

            // Check if line already has ignore comments
            if (!this.hasLineIgnore(document, line)) {
                // Ignore next line action (most common)
                actions.push(this.createIgnoreNextLineAction(document, diagnostic));

                // Ignore current line action
                actions.push(this.createIgnoreLineAction(document, diagnostic));
            }

            // Ignore entire file action (only show once per file)
            if (!this.hasFileIgnore(document) && !fileIgnoreActionAdded) {
                actions.push(this.createIgnoreFileAction(document, diagnostic));
                fileIgnoreActionAdded = true;
            }
        }

        return actions;
    }

    /**
     * Creates action to ignore the next line
     */
    private createIgnoreNextLineAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'Ignore this string (add comment on line above)',
            vscode.CodeActionKind.QuickFix
        );

        action.edit = new vscode.WorkspaceEdit();

        const line = diagnostic.range.start.line;
        const lineText = document.lineAt(line).text;
        const indentation = this.getIndentation(lineText);

        const insertPosition = new vscode.Position(line, 0);
        const commentText = `${indentation}${IGNORE_COMMENTS.NEXT_LINE}\n`;

        action.edit.insert(document.uri, insertPosition, commentText);

        action.diagnostics = [diagnostic];
        action.isPreferred = true;

        return action;
    }

    /**
     * Creates action to ignore the current line
     */
    private createIgnoreLineAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'Ignore this string (add comment at end of line)',
            vscode.CodeActionKind.QuickFix
        );

        action.edit = new vscode.WorkspaceEdit();

        const line = diagnostic.range.start.line;
        const lineText = document.lineAt(line).text;

        // Add comment at the end of the line
        const endPosition = new vscode.Position(line, lineText.trimEnd().length);
        const commentText = ` ${IGNORE_COMMENTS.LINE}`;

        action.edit.insert(document.uri, endPosition, commentText);

        action.diagnostics = [diagnostic];

        return action;
    }

    /**
     * Creates action to ignore the entire file
     */
    private createIgnoreFileAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'Ignore ALL strings in this file',
            vscode.CodeActionKind.QuickFix
        );

        action.edit = new vscode.WorkspaceEdit();

        // Find the best position to insert the ignore comment (after imports)
        const insertPosition = this.findBestInsertPosition(document);
        const commentText = `${IGNORE_COMMENTS.ALL_FILE}\n`;

        // Only add the all-file comment - parser will handle ignoring until end of file
        action.edit.insert(document.uri, insertPosition, commentText);

        action.diagnostics = [diagnostic];

        return action;
    }

    /**
     * Gets the indentation from a line of text
     */
    private getIndentation(lineText: string): string {
        const match = lineText.match(/^(\s*)/);
        return match ? match[1] : '';
    }

    /**
     * Checks if the file already has a file-level ignore
     */
    private hasFileIgnore(document: vscode.TextDocument): boolean {
        const text = document.getText();
        return text.includes(IGNORE_COMMENTS.ALL_FILE);
    }

    /**
     * Checks if a specific line already has ignore comments
     */
    private hasLineIgnore(document: vscode.TextDocument, lineNumber: number): boolean {
        const lineText = document.lineAt(lineNumber).text;

        // Check current line
        if (lineText.includes(IGNORE_COMMENTS.LINE)) {
            return true;
        }

        // Check previous line for next-line ignore
        if (lineNumber > 0) {
            const prevLineText = document.lineAt(lineNumber - 1).text;
            if (prevLineText.includes(IGNORE_COMMENTS.NEXT_LINE)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Finds the best position to insert file-level ignore comment
     */
    private findBestInsertPosition(document: vscode.TextDocument): vscode.Position {
        let insertLine = 0;

        // Skip import statements and library declarations
        for (let i = 0; i < Math.min(20, document.lineCount); i++) {
            const lineText = document.lineAt(i).text.trim();

            if (lineText.startsWith('import ') ||
                lineText.startsWith('library ') ||
                lineText.startsWith('part ') ||
                lineText.startsWith('//') ||
                lineText === '') {
                insertLine = i + 1;
            } else {
                break;
            }
        }

        return new vscode.Position(insertLine, 0);
    }
} 