/**
 * String detection core functionality
 */

import { StringMatch, IgnoreRule } from '../types';
import { REGEX_PATTERNS } from '../constants';
import { getLineAndColumn } from '../utils/position';
import { isCodeString, isVariableOrFunction, isTranslationCall } from '../utils/filters';

/**
 * Finds string literals within widget content
 */
export function findStringsInWidget(
    widgetContent: string,
    startOffset: number,
    fullContent: string
): StringMatch[] {
    const matches: StringMatch[] = [];

    let match: RegExpExecArray | null;
    while ((match = REGEX_PATTERNS.STRING_LITERAL.exec(widgetContent)) !== null) {
        const stringContent = match[2]; // Content without quotes
        const fullString = match[0]; // Full string with quotes

        // Allow empty strings for specific widgets (may be relevant for i18n)
        if (stringContent.length === 0) {
            // Empty strings in widgets like Text, title, etc. may be placeholders
        }

        // Filter strings that appear to be code
        if (isCodeString(stringContent)) {
            continue;
        }

        // Check if it's not a variable or function call
        if (isVariableOrFunction(widgetContent, match.index, stringContent)) {
            continue;
        }

        const absoluteStart = startOffset + match.index;
        const position = getLineAndColumn(fullContent, absoluteStart);
        const endPosition = getLineAndColumn(fullContent, absoluteStart + match[0].length);

        matches.push({
            content: fullString,
            startLine: position.line,
            startCol: position.column,
            endLine: endPosition.line,
            endCol: endPosition.column,
            widget: '',
            parameter: ''
        });
    }

    return matches;
}

/**
 * Filters matches based on ignore rules
 */
export function filterIgnoredMatches(matches: StringMatch[], ignoreRules: IgnoreRule[]): StringMatch[] {
    return matches.filter(match => {
        for (const rule of ignoreRules) {
            if (shouldIgnoreMatch(match, rule)) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Determines if a match should be ignored based on a rule
 */
function shouldIgnoreMatch(match: StringMatch, rule: IgnoreRule): boolean {
    switch (rule.type) {
        case 'line':
            return match.startLine === rule.startLine;
        case 'next-line':
            return match.startLine === rule.startLine;
        case 'block':
            return rule.endLine !== undefined &&
                match.startLine >= rule.startLine &&
                match.startLine <= rule.endLine;
        default:
            return false;
    }
}

/**
 * Removes duplicate matches based on position
 */
export function removeDuplicateMatches(matches: StringMatch[]): StringMatch[] {
    const seen = new Set<string>();
    const uniqueMatches: StringMatch[] = [];

    for (const match of matches) {
        const key = `${match.startLine}:${match.startCol}:${match.endLine}:${match.endCol}`;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueMatches.push(match);
        }
    }

    return uniqueMatches;
}

/**
 * Determines the parameter name for a string within widget content
 */
export function determineParameter(widgetContent: string, stringContent: string, possibleParams: string[]): string {
    for (const param of possibleParams) {
        if (param && widgetContent.includes(`${param}:`)) {
            const paramIndex = widgetContent.indexOf(`${param}:`);
            const stringIndex = widgetContent.indexOf(stringContent);

            if (stringIndex > paramIndex) {
                return param;
            }
        }
    }
    return '';
}

/**
 * Determines the parameter name for generic widgets
 */
export function determineGenericParameter(widgetContent: string, stringContent: string): string {
    const lines = widgetContent.split('\n');

    for (const line of lines) {
        if (line.includes(stringContent)) {
            const namedParamMatch = line.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
            if (namedParamMatch) {
                return namedParamMatch[1];
            }
        }
    }

    return '';
} 