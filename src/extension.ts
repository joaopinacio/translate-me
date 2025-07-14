/**
 * VS Code Extension Entry Point
 * Translate-me extension for detecting hardcoded strings in Flutter projects
 */

import * as vscode from 'vscode';
import {
  EXTENSION_NAME,
  DART_LANGUAGE_ID,
  SCAN_COMPLETE_MESSAGE,
  TOGGLE_COMMAND_ID,
  DETECTION_ENABLED_MESSAGE,
  DETECTION_DISABLED_MESSAGE
} from './constants';
import { WorkspaceScanner } from './services/workspace-scanner';
import { TranslateMeCodeActionProvider } from './providers/code-actions-provider';

let diagnosticCollection: vscode.DiagnosticCollection;
let workspaceScanner: WorkspaceScanner;
let isDetectionEnabled = true; // Detection is enabled by default

/**
 * Extension activation
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  initializeDiagnostics(context);
  initializeScanner();
  registerCodeActionProvider(context);

  await performInitialScan();
  registerEventListeners();
  registerCommands(context);
}

/**
 * Extension deactivation
 */
export function deactivate(): void {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
    diagnosticCollection.dispose();
  }
}

/**
 * Initializes the diagnostic collection
 */
function initializeDiagnostics(context: vscode.ExtensionContext): void {
  diagnosticCollection = vscode.languages.createDiagnosticCollection(EXTENSION_NAME);
  context.subscriptions.push(diagnosticCollection);
}

/**
 * Initializes the workspace scanner
 */
function initializeScanner(): void {
  workspaceScanner = new WorkspaceScanner(diagnosticCollection);
}

/**
 * Registers the code action provider
 */
function registerCodeActionProvider(context: vscode.ExtensionContext): void {
  const provider = new TranslateMeCodeActionProvider();
  const registration = vscode.languages.registerCodeActionsProvider(
    { language: DART_LANGUAGE_ID },
    provider,
    {
      providedCodeActionKinds: TranslateMeCodeActionProvider.providedCodeActionKinds
    }
  );
  context.subscriptions.push(registration);
}

/**
 * Performs initial scan on activation
 */
async function performInitialScan(): Promise<void> {
  if (isDetectionEnabled) {
    await workspaceScanner.scanWorkspace();
  }
}

/**
 * Registers event listeners for file changes
 */
function registerEventListeners(): void {
  // Listen for document saves
  vscode.workspace.onDidSaveTextDocument(handleDocumentSave);

  // Listen for document changes (for real-time updates after code actions)
  vscode.workspace.onDidChangeTextDocument(handleDocumentChange);
}

/**
 * Checks if a file is a test file (ends with _test.dart)
 */
function isTestFile(filePath: string): boolean {
  return filePath.endsWith('_test.dart');
}

/**
 * Handles document save events
 */
function handleDocumentSave(document: vscode.TextDocument): void {
  if (document.languageId === DART_LANGUAGE_ID && isDetectionEnabled && !isTestFile(document.fileName)) {
    workspaceScanner.scanFile(document);
  }
}

/**
 * Handles document change events with debouncing
 */
let changeTimeout: NodeJS.Timeout | undefined;
function handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
  if (event.document.languageId === DART_LANGUAGE_ID && isDetectionEnabled && !isTestFile(event.document.fileName)) {
    // Debounce changes to avoid too frequent scans
    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }

    changeTimeout = setTimeout(() => {
      workspaceScanner.scanFile(event.document);
    }, 500); // Wait 500ms after last change
  }
}

/**
 * Registers extension commands
 */
function registerCommands(context: vscode.ExtensionContext): void {
  const scanCommand = vscode.commands.registerCommand('translate-me.scan', handleScanCommand);
  const toggleCommand = vscode.commands.registerCommand(TOGGLE_COMMAND_ID, handleToggleCommand);

  context.subscriptions.push(scanCommand);
  context.subscriptions.push(toggleCommand);
}

/**
 * Handles manual scan command
 */
async function handleScanCommand(): Promise<void> {
  if (isDetectionEnabled) {
    await workspaceScanner.scanWorkspace();
    vscode.window.showInformationMessage(SCAN_COMPLETE_MESSAGE);
  }
}

/**
 * Handles toggle detection command
 */
async function handleToggleCommand(): Promise<void> {
  isDetectionEnabled = !isDetectionEnabled;

  if (isDetectionEnabled) {
    // If enabled, perform a scan of the workspace
    await workspaceScanner.scanWorkspace();
    vscode.window.showInformationMessage(DETECTION_ENABLED_MESSAGE);
  } else {
    // If disabled, clear all diagnostics
    diagnosticCollection.clear();
    vscode.window.showInformationMessage(DETECTION_DISABLED_MESSAGE);
  }
}
