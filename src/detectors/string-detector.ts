/**
 * String detection core functionality
 */

import { StringMatch, IgnoreRule } from '../types';
import { REGEX_PATTERNS } from '../constants';
import { getLineAndColumn } from '../utils/position';
import { shouldFilterString, isVariableOrFunction, isTranslationCall, isUriParseString, isTechnicalParameter } from '../utils/filters';

/**
 * Finds string literals within widget content, handling Dart interpolated strings correctly
 */
export function findStringsInWidget(
    widgetContent: string,
    startOffset: number,
    fullContent: string
): StringMatch[] {
    const matches: StringMatch[] = [];

    // Use custom string detection instead of regex to handle interpolated strings
    const stringMatches = findStringLiterals(widgetContent);

    for (const stringMatch of stringMatches) {
        const stringContent = stringMatch.content; // Content without quotes
        const fullString = stringMatch.fullString; // Full string with quotes

        // Filter strings that should not be translated
        if (shouldFilterString(stringContent)) {
            continue;
        }

        // Check if it's not a variable or function call
        if (isVariableOrFunction(widgetContent, stringMatch.startIndex, stringContent)) {
            continue;
        }

        // Check if this string is inside a Uri.parse() call
        if (isUriParseString(widgetContent, stringMatch.startIndex)) {
            continue;
        }

        // Check if this string is in a technical parameter that should not be translated
        if (isTechnicalParameter(widgetContent, stringMatch.startIndex)) {
            continue;
        }

        const absoluteStart = startOffset + stringMatch.startIndex;
        const position = getLineAndColumn(fullContent, absoluteStart);
        const endPosition = getLineAndColumn(fullContent, absoluteStart + stringMatch.length);

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
 * Custom string literal detection that handles Dart interpolated strings correctly
 */
function findStringLiterals(content: string): Array<{
    content: string;
    fullString: string;
    startIndex: number;
    length: number;
}> {
    const matches: Array<{
        content: string;
        fullString: string;
        startIndex: number;
        length: number;
    }> = [];

    let i = 0;
    while (i < content.length) {
        const char = content[i];

        // Check for string start
        if (char === '"' || char === "'" || char === '`') {
            const stringResult = extractStringLiteral(content, i);
            if (stringResult) {
                matches.push(stringResult);
                i = stringResult.startIndex + stringResult.length;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }

    return matches;
}

/**
 * Extract a complete string literal starting at the given index, handling interpolations
 */
function extractStringLiteral(content: string, startIndex: number): {
    content: string;
    fullString: string;
    startIndex: number;
    length: number;
} | null {
    const stringChar = content[startIndex];
    let i = startIndex + 1;
    let inInterpolation = false;
    let interpolationDepth = 0;

    while (i < content.length) {
        const char = content[i];
        const nextChar = i + 1 < content.length ? content[i + 1] : '';

        // Handle Dart string interpolation
        if (char === '$' && nextChar === '{') {
            inInterpolation = true;
            interpolationDepth = 0;
            i += 2; // Skip ${ 
            continue;
        }

        if (inInterpolation) {
            if (char === '{') {
                interpolationDepth++;
            } else if (char === '}') {
                if (interpolationDepth === 0) {
                    inInterpolation = false;
                } else {
                    interpolationDepth--;
                }
            }
        } else {
            // Only check for string end when not in interpolation
            if (char === stringChar) {
                // Check if it's not escaped
                let escapeCount = 0;
                let j = i - 1;
                while (j >= 0 && content[j] === '\\') {
                    escapeCount++;
                    j--;
                }

                // If even number of escapes (including 0), the quote is not escaped
                if (escapeCount % 2 === 0) {
                    const fullString = content.substring(startIndex, i + 1);
                    const stringContent = content.substring(startIndex + 1, i);

                    return {
                        content: stringContent,
                        fullString: fullString,
                        startIndex: startIndex,
                        length: i - startIndex + 1
                    };
                }
            }
        }

        i++;
    }

    return null; // Unterminated string
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