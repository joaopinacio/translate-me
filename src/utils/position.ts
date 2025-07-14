/**
 * Position utilities for calculating line and column positions
 */

import { Position } from '../types';

/**
 * Calculates line and column position from a character offset in content
 */
export function getLineAndColumn(content: string, offset: number): Position {
    const beforeOffset = content.substring(0, offset);
    const lines = beforeOffset.split('\n');
    return {
        line: lines.length - 1,
        column: lines[lines.length - 1].length
    };
}

/**
 * Extracts balanced parentheses content from a given start position, respecting string literals
 */
export function extractBalancedParentheses(content: string, startIndex: number): string | null {
    let depth = 0;
    let i = startIndex;
    let inString = false;
    let stringChar = '';

    while (i < content.length) {
        const char = content[i];

        // Handle string literals
        if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar) {
            // Check if it's not escaped
            let escapeCount = 0;
            let j = i - 1;
            while (j >= 0 && content[j] === '\\') {
                escapeCount++;
                j--;
            }
            // If even number of escapes (including 0), the quote is not escaped
            if (escapeCount % 2 === 0) {
                inString = false;
                stringChar = '';
            }
        }

        // Only balance parentheses when not inside a string
        if (!inString) {
            if (char === '(') {
                depth++;
            } else if (char === ')') {
                depth--;
                if (depth === 0) {
                    return content.substring(startIndex + 1, i);
                }
            }
        }

        i++;
    }

    return null; // Unbalanced parentheses
} 