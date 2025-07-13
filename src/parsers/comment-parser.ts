/**
 * Comment parser for handling ignore directives
 */

import { IgnoreRule } from '../types';
import { IGNORE_COMMENTS, REGEX_PATTERNS } from '../constants';

/**
 * Parses ignore comments from content and returns ignore rules
 */
export function parseIgnoreComments(content: string): IgnoreRule[] {
    const rules: IgnoreRule[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes(IGNORE_COMMENTS.LINE)) {
            rules.push({
                type: 'line',
                startLine: i
            });
        }

        if (line.includes(IGNORE_COMMENTS.NEXT_LINE)) {
            rules.push({
                type: 'next-line',
                startLine: i + 1
            });
        }

        if (line.includes(IGNORE_COMMENTS.ALL_FILE)) {
            rules.push({
                type: 'block',
                startLine: i,
                endLine: lines.length - 1
            });
        }
    }

    return rules;
}

/**
 * Removes comments from content but preserves ignore comments
 */
export function removeCommentsButKeepIgnores(content: string): string {
    let result = content.replace(REGEX_PATTERNS.COMMENT_SINGLE_LINE, '');
    result = result.replace(REGEX_PATTERNS.COMMENT_MULTI_LINE, '');
    return result;
} 