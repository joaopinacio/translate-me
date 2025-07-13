
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import globby from 'globby';

let diagnosticCollection: vscode.DiagnosticCollection;

export async function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('translate-me');
  context.subscriptions.push(diagnosticCollection);

  await scanWorkspaceForHardcodedStrings();

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === 'dart') {
      scanWorkspaceForHardcodedStrings();
    }
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('translate-me.scan', () => {
      scanWorkspaceForHardcodedStrings();
      vscode.window.showInformationMessage('Scan por strings fixas completo.');
    })
  );
}

export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}

async function scanWorkspaceForHardcodedStrings() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const rootPath = workspaceFolders[0].uri.fsPath;
  const dartFiles = await globby(['**/*.dart'], {
    cwd: rootPath,
    gitignore: true,
    absolute: true,
  });

  diagnosticCollection.clear();

  for (const file of dartFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const textRegex = /\b(Text|Tooltip|SnackBar|AppBar|ElevatedButton|TextButton)\s*\(\s*['\"\`][^'\"\`]*['\"\`]/g;
      let match: RegExpExecArray | null;
      while ((match = textRegex.exec(line)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const range = new vscode.Range(
          new vscode.Position(index, start),
          new vscode.Position(index, end)
        );
        diagnostics.push({
          severity: vscode.DiagnosticSeverity.Warning,
          message: `String fixa detectada em ${match[1]}. Considere usar uma tradução.`,
          range,
          source: 'translate-me',
        });
      }
    });

    diagnosticCollection.set(vscode.Uri.file(file), diagnostics);
  }
}
