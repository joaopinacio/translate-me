/**
 * Filter utilities for string validation and classification
 */

import {
    CODE_PATTERNS,
    TRANSLATION_PATTERNS,
    NON_WIDGET_PATTERNS,
    CONTEXT_PATTERNS,
    REGEX_PATTERNS
} from '../constants';

/**
 * Determines if a string is likely code rather than user text
 */
export function isCodeString(stringContent: string): boolean {
    const trimmed = stringContent.trim();

    // Allow empty strings (may be important placeholders)
    if (trimmed.length === 0) return false;

    // If contains spaces or text punctuation, probably user text
    if (REGEX_PATTERNS.WHITESPACE.test(trimmed) || REGEX_PATTERNS.TEXT_PUNCTUATION.test(trimmed)) {
        return false;
    }

    // Allow proper nouns or simple words (like 'Savana')
    if (REGEX_PATTERNS.PROPER_NOUN.test(trimmed)) {
        return false;
    }

    return CODE_PATTERNS.some(pattern => pattern.test(trimmed));
}

/**
 * Checks if a string is part of a translation call
 */
export function isTranslationCall(stringContent: string): boolean {
    return TRANSLATION_PATTERNS.some(pattern => pattern.test(stringContent));
}

/**
 * Determines if a string is used as a variable or function call
 */
export function isVariableOrFunction(widgetContent: string, stringIndex: number, stringContent: string): boolean {
    const beforeString = widgetContent.substring(0, stringIndex).trim();
    const afterString = widgetContent.substring(stringIndex + stringContent.length + 2).trim();

    // If there's a dot before the string, probably a property
    if (beforeString.endsWith('.')) return true;

    // If there are parentheses after the string, probably a function
    if (afterString.startsWith('(')) return true;

    return false;
}

/**
 * Checks if a class name is likely not a widget
 */
export function isNotAWidget(className: string, content: string, matchIndex: number): boolean {
    if (NON_WIDGET_PATTERNS.some(pattern => pattern.test(className))) {
        return true;
    }

    // Check if it's in a context that indicates it's not a widget
    const beforeMatch = content.substring(Math.max(0, matchIndex - 50), matchIndex).trim();
    return CONTEXT_PATTERNS.some(pattern => pattern.test(beforeMatch));
}

/**
 * Determines if widget content looks like a real widget (has named parameters)
 */
export function looksLikeWidget(widgetContent: string): boolean {
    // Check if it has named parameters (indicative of widgets)
    if (!REGEX_PATTERNS.NAMED_PARAMETER.test(widgetContent)) return false;

    // Check if it's not just a common function/method
    const commonFunctionPatterns = [
        /^\s*\d+\s*$/, // numbers only
        /^\s*true\s*$|^\s*false\s*$/, // booleans only
        /^\s*null\s*$/, // null only
        /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*$/, // single variable only
    ];

    return !commonFunctionPatterns.some(pattern => pattern.test(widgetContent.trim()));
} 