/**
 * Core types for the translate-me extension
 */

export interface StringMatch {
    content: string;
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
    widget: string;
    parameter: string;
}

export interface WidgetPattern {
    widget: string;
    params: string[];
}

export interface IgnoreRule {
    type: 'line' | 'next-line' | 'block';
    startLine: number;
    endLine?: number;
}

export interface Position {
    line: number;
    column: number;
}

export interface StringDetectionResult {
    matches: StringMatch[];
    errors: string[];
}

export interface CodeActionContext {
    uri: string;
    range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    diagnostics: any[];
}

export type IgnoreActionType = 'ignore-line' | 'ignore-next-line' | 'ignore-file'; 