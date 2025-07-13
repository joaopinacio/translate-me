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
 * Extracts balanced parentheses content from a given start position
 */
export function extractBalancedParentheses(content: string, startIndex: number): string | null {
    let depth = 0;
    let i = startIndex;

    while (i < content.length) {
        const char = content[i];

        if (char === '(') {
            depth++;
        } else if (char === ')') {
            depth--;
            if (depth === 0) {
                return content.substring(startIndex + 1, i);
            }
        }

        i++;
    }

    return null; // Unbalanced parentheses
} 